import { ImageIcon } from 'lucide-react';
import React from 'react';

/**
 * Landing message shown before an image is uploaded.
 */
export default function WelcomeMessage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center h-full flex flex-col justify-center items-center">
        <ImageIcon size={100} className='text-black-500 mb-6'/>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to <span className='text-black'><span className='text-blue-500'>Over</span>Lay</span>
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Upload a PNG image to get started, then add text layers with custom styling, 
        positioning, and effects. Create professional designs in minutes!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 font-semibold">1</span>
          </div>
          <span>Upload PNG Image</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 font-semibold">2</span>
          </div>
          <span>Add Text Layers</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 font-semibold">3</span>
          </div>
          <span>Export Design</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Keyboard Shortcuts</h3>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
          <span><kbd className="px-2 py-1 bg-white border rounded">Ctrl+Z</kbd> Undo</span>
          <span><kbd className="px-2 py-1 bg-white border rounded">Ctrl+Y</kbd> Redo</span>
          <span><kbd className="px-2 py-1 bg-white border rounded">←→↑↓</kbd> Nudge</span>
          <span><kbd className="px-2 py-1 bg-white border rounded">Delete</kbd> Remove</span>
          <span><kbd className="px-2 py-1 bg-white border rounded">Enter</kbd> Save</span>
        </div>
      </div>
    </div>
  );
}