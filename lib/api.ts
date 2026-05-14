import { supabase } from './supabase';

// Fetch all active listings
export async function fetchListings() {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('status', 'Active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to fetch listings:', error);
        return { data: null, error: error.message };
    }
}

// Fetch a single listing by ID
export async function fetchListingById(id: string) {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching listing:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to fetch listing:', error);
        return { data: null, error: error.message };
    }
}

// Fetch user favorites
export async function fetchUserFavorites(userId: string) {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('listing_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to fetch favorites:', error);
        return { data: null, error: error.message };
    }
}

// Add a favorite
export async function addFavorite(userId: string, listingId: string) {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, listing_id: listingId }]);

        if (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to add favorite:', error);
        return { data: null, error: error.message };
    }
}

// Remove a favorite
export async function removeFavorite(userId: string, listingId: string) {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId);

        if (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to remove favorite:', error);
        return { data: null, error: error.message };
    }
}

// Create a new listing (admin only)
export async function createListing(listingData: any) {
    try {
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData])
            .select()
            .single();

        if (error) {
            console.error('Error creating listing:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to create listing:', error);
        return { data: null, error: error.message };
    }
}

// Update a listing (admin only)
export async function updateListing(id: string, updates: any) {
    try {
        const { data, error } = await supabase
            .from('listings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating listing:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to update listing:', error);
        return { data: null, error: error.message };
    }
}

// Delete a listing (admin only)
export async function deleteListing(id: string) {
    try {
        const { data, error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting listing:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to delete listing:', error);
        return { data: null, error: error.message };
    }
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, bucket: string = 'listings') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { data: { path: filePath, url: publicUrl }, error: null };
    } catch (error: any) {
        console.error('Failed to upload image:', error);
        return { data: null, error: error.message };
    }
}

// Delete image from Supabase Storage
export async function deleteImage(path: string, bucket: string = 'listings') {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error('Error deleting image:', error);
            throw error;
        }

        return { data, error: null };
    } catch (error: any) {
        console.error('Failed to delete image:', error);
        return { data: null, error: error.message };
    }
}
