"use client";

import React from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RedoButtonProps } from './types';

/**
 * RedoButton component for re-applying the last undone action
 * 
 * Features:
 * - Loading state with spinner animation
 * - Keyboard shortcut display
 * - Tooltip with operation details
 * - Responsive design
 */
const RedoButton: React.FC<RedoButtonProps> = ({ 
    onRedo, 
    disabled, 
    isLoading 
}) => {
    const isMac = navigator.platform.includes('Mac');
    const shortcut = `${isMac ? '⌘' : 'Ctrl'}+Shift+Z`;
    const tooltipText = `Redo last undone action (${shortcut})`;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRedo}
                    disabled={disabled || isLoading}
                    className={cn(
                        "text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200",
                        "focus-visible:ring-white/50 focus-visible:ring-2",
                        disabled && "opacity-40 cursor-not-allowed",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Redo last undone action"
                    title={tooltipText}
                >
                    <RotateCw 
                        className={cn(
                            "h-4 w-4 transition-all duration-200",
                            isLoading ? "animate-spin" : "group-hover:scale-110"
                        )} 
                    />
                </Button>
            </TooltipTrigger>
            
            <TooltipContent 
                side="top" 
                sideOffset={8}
                className="bg-black/90 text-white border-white/20"
            >
                <p className="font-medium">{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default RedoButton;
