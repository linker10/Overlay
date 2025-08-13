"use client"
import useLayerStore from '@/stores/layerStore'
import LayerActionCard from '@/components/Editor/Layers/LayerActionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
/**
 * Displays and controls the list of text layers.
 *
 * Uses fine-grained selectors to avoid unnecessary re-renders.
 */
const LayersManager = () => {
    // Use individual selectors to prevent unnecessary re-renders
    const textLayers = useLayerStore(state => state.textLayers)
    const selectedTextLayerId = useLayerStore(state => state.selectedTextLayerId)
    const removeTextLayer = useLayerStore(state => state.removeTextLayer)
    const setSelectedTextLayerId = useLayerStore(state => state.setSelectedTextLayerId)
    const moveLayerUp = useLayerStore(state => state.moveLayerUp)
    const moveLayerDown = useLayerStore(state => state.moveLayerDown)

    if (textLayers.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full'>
                <h3 className='text-2xl font-bold'>
                    No layers found
                </h3>
                <p className='text-sm text-gray-500'>
                    To add a layer please click on the image.
                </p>
            </div>
        )
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Layers Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[calc(100vh-600px)] overflow-y-auto flex flex-col gap-2">
                    {
                        textLayers.map((layer) => (
                            <LayerActionCard
                                key={layer.id}
                                textLayer={layer}
                                isSelected={selectedTextLayerId === layer.id}
                                onSelect={setSelectedTextLayerId}
                                onRemove={removeTextLayer}
                                onMoveUp={moveLayerUp}
                                onMoveDown={moveLayerDown}
                                canMoveUp={true}
                                canMoveDown={true}
                            />
                        ))
                    }
                </div>
            </CardContent>
        </Card>

    )
}

export default LayersManager
