"use client";

import React from 'react';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import HistoryTimeline from './HistoryTimeline';
import StatusIndicator from './StatusIndicator';
import { useHistoryManager } from './useHistoryManager';
import useLayerStore from '@/stores/layerStore';

/**
 * HistoryIndicator component providing comprehensive history management UI
 * 
 * Features:
 * - Undo/Redo operations with loading states
 * - Visual timeline of history states
 * - Status indicators and keyboard shortcuts
 * - Toast notifications for user feedback
 * - Responsive design for all screen sizes
 * - Accessibility features throughout
 * - Initial state handling and initialization status
 */
const HistoryIndicator: React.FC = () => {
    const { isInitialized } = useLayerStore();
    
    const {
        currentIndex,
        historyLength,
        canUndo,
        canRedo,
        isUndoing,
        isRedoing,
        handleUndo,
        handleRedo,
        getHistoryItems
    } = useHistoryManager();

    const historyItems = getHistoryItems();

    // Don't render if history is not initialized yet
    if (!isInitialized) {
        return null;
    }

    return (
        <>
            <div 
                className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/20 shadow-lg"
                role="toolbar"
                aria-label="History management toolbar"
            >
                <UndoButton
                    onUndo={handleUndo}
                    disabled={!canUndo}
                    isLoading={isUndoing}
                />

                <HistoryTimeline
                    historyItems={historyItems}
                    currentIndex={currentIndex}
                    historyLength={historyLength}
                />

                <RedoButton
                    onRedo={handleRedo}
                    disabled={!canRedo}
                    isLoading={isRedoing}
                />

                <StatusIndicator
                    canUndo={canUndo}
                    currentIndex={currentIndex}
                />
            </div>
        </>
    );
};

export default HistoryIndicator;
