"use client"
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import useImageStore from '@/stores/imageStore'
import { loadImage } from '@/utils/canvasUtils'

/**
 * Image uploader with drag-and-drop and file input support.
 *
 * Only PNGs are allowed. Selected image is stored globally and persisted to
 * localStorage by the image store for reloads.
 */
const ImageUploader = () => {
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { selectedImage, setSelectedImage, removeSelectedImage } = useImageStore()

    // Sync local currentImage state with selectedImage from store
    useEffect(() => {
        if (selectedImage) {
            // Convert HTMLImageElement to display URL for the preview
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = selectedImage.naturalWidth;
                canvas.height = selectedImage.naturalHeight;
                ctx.drawImage(selectedImage, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                setCurrentImage(dataURL);
            }
        } else {
            setCurrentImage(null);
        }
    }, [selectedImage]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            setCurrentImage(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setCurrentImage(null)
        removeSelectedImage()
    }


    const handleClick = () => {
        fileInputRef.current?.click()
    }


    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        if (!file.name.toLowerCase().endsWith('.png')) {
            setError('Please select a PNG image file');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            setCurrentImage(URL.createObjectURL(file))
            const image = await loadImage(file);
            setSelectedImage(image);
        } catch (err) {
            setError('Failed to load image. Please try again.');
            console.error('Image loading error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    return (
        <>
            {currentImage ? (
                <div className="space-y-4">
                    <div className="relative">
                        <Image
                            src={currentImage}
                            alt="Background"
                            width={128}
                            height={128}
                            objectFit='cover'
                        />

                        <Button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors z-10"
                            title="Remove image"
                            aria-label="Remove image"
                        >
                            <X className="w-2 h-2" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 text-gray-400">
                            <Upload className="w-10 h-10" />
                        </div>

                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                {isLoading ? 'Loading image...' : 'Upload PNG Image'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Drag and drop a PNG file here, or click to browse
                            </p>
                        </div>

                        {isLoading && (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleFileInputChange}
                className="hidden"
            />

            <div className="mt-4 text-xs text-gray-500">
                <p>• Only PNG images are supported</p>
                <p>• Canvas will automatically resize to match image dimensions</p>
                <p>• Maximum file size: 10MB</p>
            </div>
        </>
    )
}
export default ImageUploader
