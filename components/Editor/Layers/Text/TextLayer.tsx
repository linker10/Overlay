import { useEffect, useRef, memo } from 'react'
import useLayerStore from '@/stores/layerStore'
import useImageStore from '@/stores/imageStore'
import { Text, Transformer } from 'react-konva'
import { Text as KonvaText } from 'konva/lib/shapes/Text'
import { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer'
import { TextElement } from "@/types/index.type";
import { getCanvasDimensions } from '@/utils/canvasUtils'

interface TextLayerProps {
    textLayer: TextElement
    isSelected: boolean
    onSelect: (id: string) => void
}

/**
 * Single text layer with selection, transform handles, and center snapping.
 *
 * Optimized with React.memo to avoid re-renders when irrelevant props do not change.
 */
const TextLayer = ({ textLayer, isSelected, onSelect }: TextLayerProps) => {
    const textRef = useRef<KonvaText>(null);
    const trRef = useRef<KonvaTransformer>(null);
    const { updateTextLayer, updateTextLayerImmediate, registerTextNode, unregisterTextNode } = useLayerStore(state => state)
    const { selectedImage } = useImageStore(state => state)

    useEffect(() => {
        if (isSelected && textRef.current && trRef.current) {
            // we need to attach transformer manually
            trRef.current.nodes([textRef.current]);
        }
    }, [isSelected]);

    // Register/unregister the text ref for layer movement
    useEffect(() => {
        if (textRef.current) {
            registerTextNode(textLayer.id, textRef.current);
        }
        
        return () => {
            unregisterTextNode(textLayer.id);
        };
    }, [textLayer.id, registerTextNode, unregisterTextNode]);

    // Helper function to snap to center
    const snapToCenter = (x: number, y: number, width: number, height: number) => {
        if (!selectedImage) return { x, y };
        
        const canvasDimensions = getCanvasDimensions(selectedImage);
        const centerX = canvasDimensions.width / 2;
        const centerY = canvasDimensions.height / 2;
        
        const snapThreshold = 10; // pixels
        
        let snappedX = x;
        let snappedY = y;
        
        // Snap to horizontal center
        if (Math.abs((x + width / 2) - centerX) < snapThreshold) {
            snappedX = centerX - width / 2;
        }
        
        // Snap to vertical center
        if (Math.abs((y + height / 2) - centerY) < snapThreshold) {
            snappedY = centerY - height / 2;
        }
        
        return { x: snappedX, y: snappedY };
    };

    return (
        <>
            <Text
                key={textLayer.id}
                text={textLayer.text}
                x={textLayer.x}
                y={textLayer.y}
                fontSize={textLayer.fontSize}
                fontFamily={textLayer.fontFamily}
                fontVariant={textLayer.fontVariant}
                fill={textLayer.fill}
                opacity={textLayer.opacity}
                align={textLayer.align}
                draggable={!textLayer.isEditing}
                onTap={() => {
                    onSelect(textLayer.id)
                }}
                onClick={() => {
                    onSelect(textLayer.id)
                }}
                onTransformEnd={(e) => {
                    const target = e.target as KonvaText;
                    updateTextLayer(textLayer.id, {
                        x: target.x(),
                        y: target.y(),
                        width: target.width(),
                        height: target.height(),
                        scaleX: target.scaleX(),
                        scaleY: target.scaleY(),
                        rotation: target.rotation(),
                        skewX: target.skewX(),
                        skewY: target.skewY()
                    })
                }}
                onDragMove={(e) => {
                    const target = e.target as KonvaText;
                    const snapped = snapToCenter(target.x(), target.y(), target.width(), target.height());
                    // Use immediate update for smooth dragging (no history)
                    updateTextLayerImmediate(textLayer.id, {
                        x: snapped.x,
                        y: snapped.y
                    })
                }}
                onDragEnd={(e) => {
                    const target = e.target as KonvaText;
                    const snapped = snapToCenter(target.x(), target.y(), target.width(), target.height());
                    // Final position update with history
                    updateTextLayer(textLayer.id, {
                        x: snapped.x,
                        y: snapped.y
                    })
                }}
                scaleX={textLayer.scaleX}
                scaleY={textLayer.scaleY}
                rotation={textLayer.rotation}
                skewX={textLayer.skewX}
                skewY={textLayer.skewY}
                ref={textRef}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>

    )
}

export default memo(TextLayer, (prevProps, nextProps) => {
    // Re-render if selection state changed
    if (prevProps.isSelected !== nextProps.isSelected) {
        return false;
    }
    
    // Re-render if any key properties of the text layer changed
    const prev = prevProps.textLayer;
    const next = nextProps.textLayer;
    
    return (
        prev.id === next.id &&
        prev.text === next.text &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.fontSize === next.fontSize &&
        prev.fontFamily === next.fontFamily &&
        prev.fontVariant === next.fontVariant &&
        prev.fill === next.fill &&
        prev.opacity === next.opacity &&
        prev.align === next.align &&
        prev.width === next.width &&
        prev.height === next.height &&
        prev.scaleX === next.scaleX &&
        prev.scaleY === next.scaleY &&
        prev.rotation === next.rotation &&
        prev.skewX === next.skewX &&
        prev.skewY === next.skewY
    );
})
