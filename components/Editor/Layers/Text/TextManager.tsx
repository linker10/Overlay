'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useFontsStore from '@/stores/fontStore'
import FontSelect from '@/components/FontSelect'
import { useRef } from 'react'
import useLayerStore from '@/stores/layerStore'
import { useSelectedTextLayer } from '@/hooks/useOptimizedLayerStore'
import { debounce } from '@/utils/debounce'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FONT_VARIANTS } from '@/constants'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { TextElement } from '@/types/index.type'

/**
 * Side panel for editing the selected text layer's properties.
 *
 * Uses immediate updates for responsive feedback and debounced updates for
 * persisted history to keep the UI snappy while maintaining undo/redo.
 */
const TextManager = () => {
    const { fonts } = useFontsStore((state) => state);
    
    // Use individual selectors to avoid object creation and infinite loops
    const selectedTextLayerId = useLayerStore((state) => state.selectedTextLayerId);
    const updateTextLayer = useLayerStore((state) => state.updateTextLayer);
    const updateTextLayerImmediate = useLayerStore((state) => state.updateTextLayerImmediate);
    
    // Use optimized selector for selected text layer
    const selectedTextLayer = useSelectedTextLayer();
    
    // Create debounced update functions
    const debouncedUpdateLayer = useRef(
        debounce((id: string, updates: Partial<TextElement>) => {
            updateTextLayer(id, updates);
        }, 300)
    ).current;

    const handleFontChange = (font: string) => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { fontFamily: font });
            // Also update with history
            updateTextLayer(selectedTextLayerId, { fontFamily: font });
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { text });
            // Debounced update for history and persistence
            debouncedUpdateLayer(selectedTextLayerId, { text });
        }
    }

    const handleFontVariantChange = (variant: string) => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { fontVariant: variant });
            // Also update with history
            updateTextLayer(selectedTextLayerId, { fontVariant: variant });
        }
    }

    const handleFontSizeChange = (value: number[]) => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { fontSize: value[0] });
            // Debounced update for history and persistence
            debouncedUpdateLayer(selectedTextLayerId, { fontSize: value[0] });
        }
    }

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { fill: e.target.value });
            // Also update with history
            updateTextLayer(selectedTextLayerId, { fill: e.target.value });
        }
    }

    const handleOpacityChange = (value: number[]) => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { opacity: value[0] / 100 });
            // Debounced update for history and persistence
            debouncedUpdateLayer(selectedTextLayerId, { opacity: value[0] / 100 });
        }
    }

    const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { align });
            // Also update with history
            updateTextLayer(selectedTextLayerId, { align });
        }
    }

    const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (Number.isNaN(parsed)) return;
        if (selectedTextLayerId) {
            // Immediate update for responsive UI
            updateTextLayerImmediate(selectedTextLayerId, { lineHeight: parsed });
            // Also update with history
            updateTextLayer(selectedTextLayerId, { lineHeight: parsed });
        }
    }

    if (!fonts) return <p>Loading fonts...</p>;

    return (
        <Card className="flex-1 h-full">
            <CardHeader>
                <CardTitle>Text Manager</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
                {!selectedTextLayer ? (
                    <p className="text-center text-muted-foreground">Select a text layer to edit</p>
                ) : (
                    <>
                        <div className='flex flex-col gap-2'>
                            <Label>Text</Label>
                            <Textarea value={selectedTextLayer?.text} onChange={handleTextChange} placeholder="Enter your text..." />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label>Font Family</Label>
                            <FontSelect value={selectedTextLayer?.fontFamily ?? null} onValueChange={handleFontChange} />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label>Font Variant</Label>
                            <Select value={selectedTextLayer?.fontVariant} onValueChange={handleFontVariantChange}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select font variant' />
                                </SelectTrigger>
                                <SelectContent>
                                    {FONT_VARIANTS.map((variant) => (
                                        <SelectItem key={variant.value} value={variant.value}>{variant.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label>Font Size: {selectedTextLayer?.fontSize}px</Label>
                            <Slider
                                value={[selectedTextLayer?.fontSize || 16]}
                                onValueChange={handleFontSizeChange}
                                min={8}
                                max={200}
                                step={1}
                                className="w-full"
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label>Color</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={selectedTextLayer?.fill}
                                    onChange={handleColorChange}
                                    className="w-16 h-10 rounded cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={selectedTextLayer?.fill}
                                    onChange={handleColorChange}
                                    placeholder="#000000"
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label>Opacity: {Math.round((selectedTextLayer?.opacity || 1) * 100)}</Label>
                            <Slider
                                value={[Math.round((selectedTextLayer?.opacity || 1) * 100)]}
                                onValueChange={handleOpacityChange}
                                min={0}
                                max={100}
                                step={1}
                                className="w-full"
                            />
                        </div>
                        
                <div className='flex flex-col gap-2'>
                    <Label>Line Height</Label>
                    <Input
                        type="number"
                        inputMode="numeric"
                        step={1}
                        min={1}
                        value={selectedTextLayer?.lineHeight ?? 1}
                        onChange={handleLineHeightChange}
                        className="w-full"
                    />
                </div>
                
                        <div className='flex flex-col gap-2'>
                            <Label>Text Alignment</Label>
                            <div className="flex gap-1">
                                <Button
                                    variant={selectedTextLayer?.align === 'left' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleAlignmentChange('left')}
                                    className="flex-1"
                                >
                                    <AlignLeft size={16} />
                                </Button>
                                <Button
                                    variant={selectedTextLayer?.align === 'center' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleAlignmentChange('center')}
                                    className="flex-1"
                                >
                                    <AlignCenter size={16} />
                                </Button>
                                <Button
                                    variant={selectedTextLayer?.align === 'right' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleAlignmentChange('right')}
                                    className="flex-1"
                                >
                                    <AlignRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default TextManager;