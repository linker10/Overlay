"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useLayerStore from "@/stores/layerStore";
import { HistoryManagerState, HistoryItem } from "./types";
import { toast } from "sonner";

/**
 * Custom hook for managing history operations with enhanced UX features
 * 
 * Features:
 * - Undo/Redo operations with loading states
 * - Keyboard shortcuts (⌘/Ctrl + Z, ⌘/Ctrl + Shift + Z)
 * - Optimized history item calculations
 * - Error handling and state management
 * - Full TypeScript support with strict typing
 * - Initial state handling and initialization
 * 
 * @returns {HistoryManagerState} Complete state and functions for history management
 */
export const useHistoryManager = (): HistoryManagerState => {
    const { 
        historyManager, 
        undo, 
        redo, 
        isInitialized,
        initializeHistory 
    } = useLayerStore();
    
    // Local state for UI feedback
    const [isUndoing, setIsUndoing] = useState(false);
    const [isRedoing, setIsRedoing] = useState(false);

    // Initialize history if not already done
    useEffect(() => {
        if (!isInitialized) {
            initializeHistory();
        }
    }, [isInitialized, initializeHistory]);

    // Derived state from history manager
    const currentIndex = historyManager.getCurrentIndex();
    const historyLength = historyManager.getHistoryLength();
    const canUndo = !historyManager.isUndoDisabled();
    const canRedo = !historyManager.isRedoDisabled();

    // Enhanced undo operation with loading state and feedback
    const handleUndo = useCallback(async (): Promise<void> => {
        if (!canUndo || isUndoing) return;

        try {
            setIsUndoing(true);
            undo();
            toast.success("Undo completed");
        } catch (error) {
            console.error("Undo operation failed:", error);
        } finally {
            // Ensure loading state is cleared even if operation fails
            setTimeout(() => setIsUndoing(false), 300);
        }
    }, [canUndo, isUndoing, undo]);

    // Enhanced redo operation with loading state and feedback
    const handleRedo = useCallback(async (): Promise<void> => {
        if (!canRedo || isRedoing) return;

        try {
            setIsRedoing(true);
            redo();
            toast.success("Redo completed");
        } catch (error) {
            console.error("Redo operation failed:", error);
        } finally {
            // Ensure loading state is cleared even if operation fails
            setTimeout(() => setIsRedoing(false), 300);
        }
    }, [canRedo, isRedoing, redo]);

    // Keyboard shortcuts for undo/redo operations
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isModifierKey = event.metaKey || event.ctrlKey;
            const isZKey = event.key.toLowerCase() === 'z';
            const isShiftKey = event.shiftKey;

            if (isModifierKey && isZKey) {
                event.preventDefault();
                
                if (isShiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };

        // Add event listener
        window.addEventListener("keydown", handleKeyDown);
        
        // Cleanup function
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleUndo, handleRedo]);

    // Memoized history items calculation for performance
    const getHistoryItems = useCallback((): HistoryItem[] => {
        const items: HistoryItem[] = [];
        const maxItems = Math.min(8, historyLength); // Limit to 8 items for UI clarity
        const startIndex = Math.max(0, currentIndex - Math.floor(maxItems / 2));
        
        for (let i = 0; i < maxItems; i++) {
            const index = startIndex + i;
            if (index < historyLength) {
                items.push({
                    index,
                    isCurrent: index === currentIndex,
                    isActive: index <= currentIndex,
                });
            }
        }
        
        return items;
    }, [currentIndex, historyLength]);

    // Memoized return value to prevent unnecessary re-renders
    return useMemo((): HistoryManagerState => ({
        currentIndex,
        historyLength,
        canUndo,
        canRedo,
        isUndoing,
        isRedoing,
        handleUndo,
        handleRedo,
        getHistoryItems,
    }), [
        currentIndex,
        historyLength,
        canUndo,
        canRedo,
        isUndoing,
        isRedoing,
        handleUndo,
        handleRedo,
        getHistoryItems,
    ]);
};
