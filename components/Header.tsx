"use client"
import { toast } from 'sonner'
import { HistoryIndicator } from './History'
import { Button } from './ui/button'
import useLayerStore from '@/stores/layerStore'
import useImageStore from '@/stores/imageStore'
import { RefreshCw } from 'lucide-react'

/**
 * App header with branding, reset action, and history controls.
 */
const Header = () => {
    const { clearLocalStorage } = useLayerStore()
    const { removeSelectedImage, clearImageFromLocalStorage } = useImageStore()

    const handleReset = () => {
        if (confirm('Are you sure you want to clear all layers and reset the editor? This action cannot be undone.')) {
            // Clear both layers and image
            clearLocalStorage()
            removeSelectedImage()
            clearImageFromLocalStorage()
            toast.success('Editor reset successfully')
        }
    }

    return (
        <header className="bg-black text-white px-4 sm:px-6 py-6 rounded-lg mx-4 sm:mx-10 mt-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h4 className="text-xl sm:text-2xl font-bold">
                    <span className="text-blue-500">Over</span>
                    <span className="text-white">lay</span>
                </h4>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Reset Button */}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleReset}
                        className="border-white text-black hover:bg-white hover:text-black"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Reset
                    </Button>

                    {/* History Indicator */}
                    <div className="w-full sm:w-auto">
                        <HistoryIndicator />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
