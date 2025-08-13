import { create } from "zustand";

interface ImageStore {
    selectedImage: HTMLImageElement | null;
    setSelectedImage: (image: HTMLImageElement) => void;
    removeSelectedImage: () => void;
    saveImageToLocalStorage: (image: HTMLImageElement) => void;
    loadImageFromLocalStorage: () => Promise<void>;
    clearImageFromLocalStorage: () => void;
}

const STORAGE_KEY = 'image-text-composer-image';

/**
 * Manages the selected image and its persistence to localStorage.
 */
const useImageStore = create<ImageStore>((set, get) => ({
    selectedImage: null,
    
    setSelectedImage: (image) => {
        set({ selectedImage: image });
        // Auto-save to localStorage when image is set
        get().saveImageToLocalStorage(image);
    },
    
    removeSelectedImage: () => {
        set({ selectedImage: null });
        // Clear from localStorage when removed
        get().clearImageFromLocalStorage();
    },

    saveImageToLocalStorage: (image: HTMLImageElement) => {
        try {
            // Create a canvas to convert the image to base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) return;
            
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);
            
            // Convert to base64
            const imageData = canvas.toDataURL('image/png');
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, imageData);
        } catch (error) {
            console.error('Failed to save image to localStorage:', error);
        }
    },

    loadImageFromLocalStorage: async () => {
        try {
            const imageData = localStorage.getItem(STORAGE_KEY);
            if (!imageData) return;

            // Create a new image from the saved data
            const image = new Image();
            
            return new Promise<void>((resolve) => {
                image.onload = () => {
                    set({ selectedImage: image });
                    resolve();
                };
                image.onerror = () => {
                    // If image fails to load, clear it from localStorage
                    localStorage.removeItem(STORAGE_KEY);
                    resolve();
                };
                image.src = imageData;
            });
        } catch (error) {
            console.error('Failed to load image from localStorage:', error);
        }
    },

    clearImageFromLocalStorage: () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear image from localStorage:', error);
        }
    }
}))

export default useImageStore;