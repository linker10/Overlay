"use client";

import React from 'react';
import { CheckCircle2, Zap, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusIndicatorProps } from './types';
import { cn } from '@/lib/utils';

/**
 * StatusIndicator component displaying current history status and keyboard shortcuts
 * 
 * Features:
 * - Current changes count display
 * - Keyboard shortcut hints
 * - Initial state indication
 * - Responsive design (hidden on small screens)
 * - Accessibility features
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ currentIndex }) => {
    const isMac = navigator.platform.includes('Mac');
    const shortcut = `${isMac ? '⌘Z' : 'Ctrl+Z'}`;
    const isAtInitialState = currentIndex === 0;
    
    // Determine status text based on current position
    const getStatusText = () => {
        if (isAtInitialState) {
            return 'Initial state';
        }
        if (currentIndex === 1) {
            return '1 change';
        }
        return `${currentIndex} changes`;
    };

    const statusText = getStatusText();

    return (
        <>
            {/* Current Status Indicator - Hidden on small screens */}
            <div 
                className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-white/20"
                role="status"
                aria-live="polite"
            >
                {isAtInitialState ? (
                    <RotateCcw 
                        className="h-3 w-3 text-blue-400" 
                        aria-hidden="true"
                    />
                ) : (
                    <CheckCircle2 
                        className="h-3 w-3 text-green-400" 
                        aria-hidden="true"
                    />
                )}
                <Badge 
                    variant="outline" 
                    className={cn(
                        "border-white/20 text-xs font-medium",
                        isAtInitialState 
                            ? "bg-blue-500/20 text-blue-300 border-blue-400/30" 
                            : "bg-transparent text-white/70"
                    )}
                    aria-label={`Status: ${statusText}`}
                >
                    {statusText}
                </Badge>
            </div>

            {/* Keyboard Shortcuts Hint - Hidden on small screens */}
            <div 
                className="hidden sm:flex items-center gap-1 ml-2 pl-3 border-l border-white/20"
                role="note"
                aria-label="Keyboard shortcuts"
            >
                <Zap 
                    className="h-3 w-3 text-yellow-400" 
                    aria-hidden="true"
                />
                <Badge 
                    variant="outline" 
                    className="bg-transparent text-white/50 border-white/20 font-mono text-xs"
                    aria-label={`Shortcut: ${shortcut}`}
                >
                    {shortcut}
                </Badge>
            </div>
        </>
    );
};

export default StatusIndicator;
