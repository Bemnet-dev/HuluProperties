"use client";
import React, { useState } from 'react';
import { UploadCloud, Save, X, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function NewListingPage() {
  const router = useRouter();
  const [assetType, setAssetType] = useState('Property');
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }, { key: '', value: '' }]);
  const [listingStatus, setListingStatus] = useState<'Active' | 'Draft'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [coverIndex, setCoverIndex] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('edit');
      if (id) {
        setEditId(id);
        const fetchListing = async () => {
          const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
          if (data) {
            if (formRef.current) {
              const titleInput = formRef.current.elements.namedItem('title') as HTMLInputElement;
              if (titleInput) titleInput.value = data.title;
              
              const priceInput = formRef.current.elements.namedItem('price') as HTMLInputElement;
              if (priceInput) priceInput.value = data.price;
              
              const locationInput = formRef.current.elements.namedItem('location') as HTMLInputElement;
              if (locationInput) locationInput.value = data.location;
              
              const descInput = formRef.current.elements.namedItem('description') as HTMLTextAreaElement;
              if (descInput) descInput.value = data.description;
            }
            setAssetType(data.type);
            setListingStatus(data.status);
            if (data.specs && data.specs.length > 0) setSpecs(data.specs);
            if (data.images && data.images.length > 0) setExistingImages(data.images);
          }
        };
        // Small delay to ensure form ref is mounted
        setTimeout(fetchListing, 50);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    if (index === coverIndex) {
      setCoverIndex(0);
    } else if (index < coverIndex) {
      setCoverIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const uploadedImageUrls = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        let uploadError, data;

        const uploadResult = await supabase.storage
          .from('assets')
          .upload(filePath, file);

        uploadError = uploadResult.error;
        data = uploadResult.data;
          
        if (uploadError && uploadError.message === 'Bucket not found') {
          // Try to create the bucket if it doesn't exist
          const { error: createBucketError } = await supabase.storage.createBucket('assets', {
            public: true,
            fileSizeLimit: 15728640, // 15MB
          });
          
          if (!createBucketError) {
            // Retry upload
            const retryResult = await supabase.storage
              .from('assets')
              .upload(filePath, file);
              
            uploadError = retryResult.error;
            data = retryResult.data;
          } else {
             console.error("Failed to create bucket:", createBucketError);
             console.warn("Continuing submission without image upload due to bucket error.");
             // We don't throw here so the user can test the UI flow without setting up Supabase Storage fully.
          }
        }

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Fallback if bucket doesn't exist etc.
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);
          uploadedImageUrls.push(publicUrl);
        }
      }

      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get('title') as string;
      const price = formData.get('price') as string;
      const location = formData.get('location') as string;
      const description = formData.get('description') as string;

      const finalImages = [...existingImages, ...uploadedImageUrls];
      
      const payload = {
        title,
        price: price.toString(),
        location,
        description,
        type: assetType,
        status: listingStatus,
        images: finalImages,
        specs: specs.filter(s => s.key && s.value)
      };

      let dbError;
      if (editId) {
        const { error } = await supabase.from('listings').update(payload).eq('id', editId);
        dbError = error;
      } else {
        const { error } = await supabase.from('listings').insert([payload]);
        dbError = error;
      }

      if (dbError) {
        console.error("Database insert error:", dbError);
        if (dbError.message.includes('row-level security')) {
            throw new Error("Row-Level Security (RLS) is blocking the insert. Please make sure you are logged in, or update your Supabase RLS policies to allow anonymous inserts during testing.");
        }
        throw new Error(dbError.message);
      }
      
      setIsSubmitting(false);
      alert(`Listing ${listingStatus === 'Draft' ? 'saved to drafts' : 'published'} successfully!`);
      router.push('/admin/listings');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      
      const errorMessage = error instanceof Error ? error.message : "An error occurred during submission";
      if (errorMessage === 'Failed to fetch') {
         alert("Network error: Could not connect to Supabase. Please ensure your NEXT_PUBLIC_SUPABASE_URL is set correctly in your .env file.");
      } else {
         alert("Publishing Failed:\n" + errorMessage);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl w-full mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-500 transition-colors">
          <X size={20} />
        </Link>
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{editId ? 'Edit Listing' : 'Create New Listing'}</h1>
        <p className="text-zinc-500 font-medium mt-2">{editId ? 'Modify the details of your listing.' : 'Add a new asset to the platform inventory.'}</p>
      </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Info */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-100 pb-4">1. Core Information</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Asset Type</label>
            
            {/* Desktop View: Button Grid */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {['Property', 'Vehicle', 'Land'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAssetType(type)}
                  className={`py-3 px-4 rounded-xl font-bold transition-all border ${
                    assetType === type 
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-sm' 
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Mobile View: Dropdown */}
            <div className="md:hidden flex flex-col border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm group">
              <button 
                type="button"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)} 
                className="flex items-center justify-between w-full px-5 py-4 font-bold text-zinc-900 bg-white hover:bg-zinc-50 transition-colors focus:outline-none"
              >
                {assetType}
                {mobileDropdownOpen ? <ChevronUp className="text-zinc-400 group-hover:text-zinc-600 transition-colors" size={20} /> : <ChevronDown className="text-zinc-400 group-hover:text-zinc-600 transition-colors" size={20} />}
              </button>
              {mobileDropdownOpen && (
                <div className="flex flex-col bg-zinc-50 border-t border-zinc-100">
                  {['Property', 'Vehicle', 'Land'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setAssetType(type);
                        setMobileDropdownOpen(false);
                      }}
                      className={`text-left px-5 py-4 font-semibold transition-colors border-l-2 ${
                        assetType === type ? 'text-emerald-900 bg-emerald-50 border-emerald-600' : 'text-zinc-600 hover:bg-zinc-100 border-transparent hover:border-zinc-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Listing Title <span className="text-red-500">*</span></label>
              <input required name="title" type="text" placeholder="e.g. Modern Cliffside Villa" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700">Asking Price (ETB) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">ETB</span>
                <input required name="price" type="number" placeholder="2,500,000" className="w-full pl-14 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-zinc-700">Location / Address <span className="text-red-500">*</span></label>
              <input required name="location" type="text" placeholder="City, State, Country" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
             <h2 className="text-xl font-bold">2. High-Resolution Media</h2>
             <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-1 rounded uppercase flex items-center gap-1"><Info size={14}/> Max 15MB each</span>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-zinc-50/50 hover:bg-zinc-50 hover:border-emerald-500 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white shadow-sm border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 mb-4 transition-colors">
              <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Click to upload assets</h3>
            <p className="text-zinc-500 mb-6 font-medium max-w-sm">Drag and drop high-res JPEG, PNG, or RAW files. First image acts as cover.</p>
            <button type="button" className="bg-white border border-zinc-200 text-zinc-700 px-6 py-2.5 rounded-lg font-semibold shadow-sm group-hover:border-emerald-200 transition-colors pointer-events-none">
              Browse Files
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>

          {(existingImages.length > 0 || previewUrls.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {existingImages.map((url, i) => (
                <div key={`ext-${i}`} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-sm group">
                  <Image src={url} alt={`Existing ${i}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setExistingImages(prev => prev.filter((_, idx) => idx !== i));
                      }} 
                      className="bg-white/90 p-2 rounded-full text-red-600 hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {i === 0 && previewUrls.length === 0 && (
                    <div className="absolute top-2 left-2 bg-emerald-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      Cover
                    </div>
                  )}
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={url} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-sm group">
                  <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {i !== coverIndex && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setCoverIndex(i); }} 
                        className="bg-white/90 px-3 py-1.5 rounded-full text-zinc-900 text-xs font-bold hover:scale-105 transition-transform"
                      >
                        Set Cover
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                      className="bg-white/90 p-2 rounded-full text-red-600 hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {i === coverIndex && (
                    <div className="absolute top-2 left-2 bg-emerald-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & Specs */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-zinc-100 pb-4">3. Specifications</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-700">Detailed Description <span className="text-red-500">*</span></label>
            <textarea required name="description" rows={6} placeholder="Describe the unique features, provenance, and specifications..." className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium resize-none"></textarea>
          </div>
          
          <div className="space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                   <label className="block text-xs font-semibold text-zinc-500 uppercase">Key Spec {index + 1}</label>
                   <input 
                     type="text" 
                     value={spec.key}
                     onChange={(e) => {
                       const newSpecs = [...specs];
                       newSpecs[index].key = e.target.value;
                       setSpecs(newSpecs);
                     }}
                     placeholder={index === 0 ? (assetType === 'Vehicle' ? "Engine" : "Bedrooms") : (index === 1 ? (assetType === 'Vehicle' ? "0-60 mph" : "Square Feet") : "e.g. Mileage")} 
                     className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50" 
                   />
                </div>
                <div className="space-y-2 flex-1">
                   <label className="block text-xs font-semibold text-zinc-500 uppercase">Value {index + 1}</label>
                   <input 
                     type="text" 
                     value={spec.value}
                     onChange={(e) => {
                       const newSpecs = [...specs];
                       newSpecs[index].value = e.target.value;
                       setSpecs(newSpecs);
                     }}
                     placeholder={index === 0 ? "e.g. 4.0L V8" : (index === 1 ? "e.g. 10,000" : "e.g. 15,000")} 
                     className="w-full px-4 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/50" 
                   />
                </div>
                {specs.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => {
                      const newSpecs = specs.filter((_, i) => i !== index);
                      setSpecs(newSpecs);
                    }}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 mb-1"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            onClick={() => setSpecs([...specs, { key: '', value: '' }])}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mt-2 inline-block"
          >
            + Add more specifications
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
          <Link href="/admin" className="px-6 py-3 font-semibold text-zinc-500 hover:text-zinc-800 transition-colors w-full sm:w-auto text-center">
            Cancel
          </Link>
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={() => {
              if (formRef.current && formRef.current.reportValidity()) {
                if (files.length === 0) {
                  console.log("No media files attached to draft.");
                }
                setListingStatus('Draft');
                // Use setTimeout to allow state to update before requesting submit
                setTimeout(() => {
                  formRef.current?.requestSubmit();
                }, 0);
              }
            }}
            className="flex justify-center items-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-6 py-3 rounded-xl font-bold hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-95 disabled:opacity-70 w-full sm:w-auto"
          >
            Save to Draft
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => setListingStatus('Active')}
            className="flex justify-center items-center gap-2 bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-sm active:scale-95 disabled:opacity-70 w-full sm:w-auto"
          >
            {isSubmitting && listingStatus === 'Active' ? (
              <span className="animate-pulse">{editId ? 'Updating...' : 'Processing...'}</span>
            ) : (
              <><Save size={20} /> {editId ? 'Update Listing' : 'Publish Listing'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
