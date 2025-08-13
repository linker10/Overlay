import { Card, CardContent } from '@/components/ui/card'
import { Check, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextElement } from "@/types/index.type";
import { memo } from 'react';

interface LayerActionCardProps {
    textLayer: TextElement,
    isSelected: boolean,
    onSelect: (id: string | null) => void,
    onRemove: (id: string) => void,
    onMoveUp: (id: string) => void,
    onMoveDown: (id: string) => void,
    canMoveUp: boolean,
    canMoveDown: boolean,
}

/**
 * Row item for managing a single text layer (select, move, delete).
 */
const LayerActionCard = ({ textLayer, isSelected, onSelect, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: LayerActionCardProps) => {
    return (
        <Card key={textLayer.id}>
            <CardContent className='flex items-center justify-between'>
                <p>{textLayer.text.length > 8 ? textLayer.text.slice(0, 8) + '...' : textLayer.text}</p>
                <div className='flex items-center gap-1'>
                    <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!canMoveUp}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp(textLayer.id);
                        }}
                        className='p-1 h-8 w-8'
                    >
                        <ChevronUp size={16} />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!canMoveDown}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown(textLayer.id);
                        }}
                        className='p-1 h-8 w-8'
                    >
                        <ChevronDown size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className='bg-blue-500 hover:bg-blue-600 text-white hover:text-white p-1 h-8 w-8' onClick={(e) => {
                        e.stopPropagation();
                        onSelect(isSelected ? null : textLayer.id)
                    }}>
                        {isSelected ? <Check size={16} /> : <Edit2 size={16} />}
                    </Button>
                    <Button variant="outline" size="sm" className='bg-red-500 hover:bg-red-600 text-white hover:text-white p-1 h-8 w-8' onClick={(e) => {
                        e.stopPropagation();
                        onRemove(textLayer.id)
                    }}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default memo(LayerActionCard, (prevProps, nextProps) => {
    // Compare by layer ID and relevant properties instead of object reference
    return (
        prevProps.textLayer.id === nextProps.textLayer.id &&
        prevProps.textLayer.text === nextProps.textLayer.text &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.canMoveUp === nextProps.canMoveUp &&
        prevProps.canMoveDown === nextProps.canMoveDown
    );
})
