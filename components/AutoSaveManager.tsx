"use client"
import { useEffect } from 'react'
import useLayerStore from '@/stores/layerStore'

/**
 * Loads persisted layer state from localStorage on app mount.
 * This component does not render UI.
 */
const AutoSaveManager = () => {
    const { loadFromLocalStorage } = useLayerStore()

    useEffect(() => {
        // Load saved state on app initialization
        loadFromLocalStorage()
    }, [loadFromLocalStorage])

    // This component doesn't render anything
    return null
}

export default AutoSaveManager
