"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  className?: string;
}

export default function ImageUpload({ onUpload, defaultImage, className }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImage || null);

  const handleUpload = (result: any) => {
    const info = result.info;
    if (info && info.secure_url) {
      setImageUrl(info.secure_url);
      onUpload(info.secure_url);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      {imageUrl && (
        <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-neutral-200">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
      )}
      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
        onSuccess={handleUpload}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-600 font-medium w-full"
            >
              <UploadCloud className="w-5 h-5" />
              {imageUrl ? "Change Image" : "Upload an Image"}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
