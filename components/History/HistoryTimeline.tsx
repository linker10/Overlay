"use client";

import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { HistoryTimelineProps } from './types';

/**
 * HistoryTimeline component displaying visual representation of history states
 * 
 * Features:
 * - Interactive timeline dots with hover states
 * - Current position indicator with animation
 * - Initial state visualization
 * - Responsive design for mobile and desktop
 * - Accessibility features with ARIA labels
 */
const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ 
    historyItems, 
    currentIndex, 
    historyLength 
}) => {
    // Memoize the history items to prevent unnecessary re-renders
    const timelineItems = useMemo(() => 
        historyItems.map((item) => ({
            ...item,
            key: `history-${item.index}`,
            tooltipText: item.isCurrent 
                ? (item.index === 0 ? 'Initial state (Current)' : `Current state (${item.index + 1})`)
                : (item.index === 0 ? 'Initial state' : `History point ${item.index + 1}`),
            isInitialState: item.index === 0
        })), 
        [historyItems]
    );

    const isAtInitialState = currentIndex === 0;

    return (
        <div className="flex items-center gap-1" role="region" aria-label="History timeline">
            <Clock 
                className="h-4 w-4 text-white/60 mr-1 sm:mr-2" 
                aria-hidden="true"
            />
            
            <div 
                className="flex items-center gap-1"
                role="list"
                aria-label="History points"
            >
                {timelineItems.map((item) => (
                    <Tooltip key={item.key}>
                        <TooltipTrigger asChild>
                            <div
                                role="listitem"
                                aria-label={item.tooltipText}
                                aria-current={item.isCurrent ? 'true' : 'false'}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer relative",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                                    item.isInitialState
                                        ? item.isCurrent 
                                            ? "bg-blue-500 scale-125 shadow-lg shadow-blue-500/50 animate-pulse" 
                                            : "bg-blue-300 hover:bg-blue-400 hover:scale-110"
                                        : item.isCurrent 
                                            ? "bg-blue-400 scale-125 shadow-lg shadow-blue-400/50 animate-pulse" 
                                            : item.isActive 
                                                ? "bg-white/60 hover:bg-white/80 hover:scale-110" 
                                                : "bg-white/20 hover:bg-white/40 hover:scale-110",
                                    "hover:scale-110"
                                )}
                                tabIndex={0}
                            >
                                {item.isCurrent && (
                                    <span className="sr-only">
                                        {item.isInitialState ? 'Current: Initial state' : 'Current history point'}
                                    </span>
                                )}
                            </div>
                        </TooltipTrigger>
                        
                        <TooltipContent 
                            side="top" 
                            sideOffset={6}
                            className={cn(
                                "font-medium text-xs",
                                item.isInitialState 
                                    ? "bg-blue-500 text-white border-blue-400" 
                                    : "bg-white/90 text-black border-white/20"
                            )}
                        >
                            <p>{item.tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            
            <Badge 
                variant="outline" 
                className={cn(
                    "ml-1 sm:ml-2 font-mono text-xs",
                    isAtInitialState
                        ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                        : "bg-white/10 text-white/60 border-white/20"
                )}
                aria-label={`History position: ${currentIndex + 1} of ${historyLength}`}
            >
                {currentIndex + 1}/{historyLength}
            </Badge>
        </div>
    );
};

export default HistoryTimeline;
