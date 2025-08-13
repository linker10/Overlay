"use client"
import React, { useRef, useEffect } from 'react'
import { Layer, Stage, Image as KonvaImage } from 'react-konva'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import useImageStore from '@/stores/imageStore'
import { getCanvasDimensions } from '@/utils/canvasUtils'
import useLayerStore from '@/stores/layerStore'
import useCanvasStore from '@/stores/canvasStore'
import TextLayer from '@/components/Editor/Layers/Text/TextLayer'
import { TextElement } from '@/types/index.type'

/**
 * Interactive editor stage that renders the selected image and text layers.
 *
 * Responsibilities:
 * - Initialize and persist the Konva Stage reference
 * - Create new text layers on stage clicks
 * - Support arrow-key nudging when a text layer is selected
 * - Render image and text layers with Konva
 */
const Editor = () => {
    const { selectedImage } = useImageStore()
    const { setStage } = useCanvasStore()
    const { textLayers, addTextLayer, updateTextLayer, selectedTextLayerId, setSelectedTextLayerId } = useLayerStore()
    const stageRef = useRef<KonvaStage>(null)

    useEffect(() => {
        if (stageRef.current) {
            setStage(stageRef.current)
        }
    }, [setStage])

    // Arrow key nudging functionality
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedTextLayerId) return;
            
            const nudgeDistance = 1;
            let deltaX = 0;
            let deltaY = 0;
            
            switch (e.key) {
                case 'ArrowLeft':
                    deltaX = -nudgeDistance;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    deltaX = nudgeDistance;
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    deltaY = -nudgeDistance;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    deltaY = nudgeDistance;
                    e.preventDefault();
                    break;
                default:
                    return;
            }
            
            const selectedLayer = textLayers.find(layer => layer.id === selectedTextLayerId);
            if (selectedLayer) {
                updateTextLayer(selectedTextLayerId, {
                    x: selectedLayer.x + deltaX,
                    y: selectedLayer.y + deltaY
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedTextLayerId, textLayers, updateTextLayer])

    /**
     * Handle clicks on the stage: deselect current text or create a new text layer.
     */
    const handleStageClick = (e: { target: { attrs: Record<string, unknown> } }) => {
        // Don't create new text if we're already editing
        if ('text' in e.target.attrs) {
            return;
        }

        if (selectedTextLayerId) {
            // When user clicks on the stage, deselect the text layer
            setSelectedTextLayerId(null)
        }

        // Click was on the stage (not on a text element), create new text
        const pointerPosition = stageRef.current?.getPointerPosition()
        if (!pointerPosition) return

        const newText: TextElement = {
            id: Date.now().toString(),
            text: 'New Text',
            x: pointerPosition.x,
            y: pointerPosition.y,
            fontSize: 20,
            fill: '#000000',
            opacity: 1,
            align: 'left',
            fontFamily: 'Arial',
            fontVariant: 'normal',
            isEditing: false,
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            skewX: 0,
            skewY: 0
        }

        addTextLayer(newText)
        // Automatically select the new text layer
        setSelectedTextLayerId(newText.id)
    }


    if (!selectedImage) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No image selected</p>
            </div>
        )
    }

    return (
        <div className="rounded-md flex items-center justify-center relative">
            {selectedImage && (
                <Stage
                    ref={stageRef}
                    width={getCanvasDimensions(selectedImage).width}
                    height={getCanvasDimensions(selectedImage).height}
                    className='border-2 border-dashed border-gray-300 rounded-md relative'
                    onClick={handleStageClick}
                >
                    <Layer>
                        <KonvaImage
                            image={selectedImage}
                            width={getCanvasDimensions(selectedImage).width}
                            height={getCanvasDimensions(selectedImage).height}
                        />
                    </Layer>
                    <Layer>
                        {textLayers.map((textLayer) => (
                            <TextLayer 
                                key={textLayer.id} 
                                textLayer={textLayer} 
                                isSelected={selectedTextLayerId === textLayer.id} 
                                onSelect={setSelectedTextLayerId}
                            />
                        ))}
                    </Layer>
                </Stage>
            )}

        </div>
    )
}

export default Editor
