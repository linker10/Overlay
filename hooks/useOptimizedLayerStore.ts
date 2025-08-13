import useLayerStore from '@/stores/layerStore'

// Optimized selector hooks to prevent unnecessary re-renders

// Get a specific text layer by ID
/**
 * Selector for a specific text layer by ID. Returns null if not found.
 */
export const useTextLayer = (layerId: string | null) => {
  return useLayerStore((state) => 
    state.textLayers.find(layer => layer.id === layerId) || null
  )
}

// Get selected text layer  
/** Selector for the currently selected text layer. */
export const useSelectedTextLayer = () => {
  return useLayerStore((state) => {
    if (!state.selectedTextLayerId) return null
    return state.textLayers.find(layer => layer.id === state.selectedTextLayerId) || null
  })
}

// Get only the layer count (for performance)
/** Selector for the total number of layers. */
export const useLayerCount = () => {
  return useLayerStore((state) => state.textLayers.length)
}

// Get layer order info for a specific layer
/** Selector for order/movement info of a particular layer ID. */
export const useLayerOrderInfo = (layerId: string) => {
  return useLayerStore((state) => {
    const index = state.textLayers.findIndex(layer => layer.id === layerId)
    return {
      index,
      canMoveUp: index < state.textLayers.length - 1,
      canMoveDown: index > 0,
      totalLayers: state.textLayers.length
    }
  })
}
