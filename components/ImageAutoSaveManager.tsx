"use client";

import { useEffect } from 'react';
import useImageStore from '@/stores/imageStore';

/**
 * Loads a persisted image from localStorage on app mount.
 * This component does not render UI.
 */
const ImageAutoSaveManager = () => {
    const loadImageFromLocalStorage = useImageStore(state => state.loadImageFromLocalStorage);

    useEffect(() => {
        // Load saved image when component mounts
        loadImageFromLocalStorage();
    }, [loadImageFromLocalStorage]);

    return null; // This component doesn't render anything
};

export default ImageAutoSaveManager;
