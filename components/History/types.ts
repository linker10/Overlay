/**
 * Type definitions for History components
 * 
 * This file contains all the interfaces and types used by the history management system.
 * Types are designed to be strict and provide good IntelliSense support.
 */

/**
 * Represents a single history point in the timeline
 */
export interface HistoryItem {
    /** Unique identifier for the history point */
    index: number;
    /** Whether this is the current active state */
    isCurrent: boolean;
    /** Whether this history point has been reached */
    isActive: boolean;
}

/**
 * Props for the HistoryTimeline component
 */
export interface HistoryTimelineProps {
    /** Array of history items to display */
    historyItems: HistoryItem[];
    /** Current position in the history */
    currentIndex: number;
    /** Total number of history items */
    historyLength: number;
}

/**
 * Props for the UndoButton component
 */
export interface UndoButtonProps {
    /** Callback function when undo is triggered */
    onUndo: () => void;
    /** Whether the button should be disabled */
    disabled: boolean;
    /** Whether an undo operation is currently in progress */
    isLoading: boolean;
}

/**
 * Props for the RedoButton component
 */
export interface RedoButtonProps {
    /** Callback function when redo is triggered */
    onRedo: () => void;
    /** Whether the button should be disabled */
    disabled: boolean;
    /** Whether a redo operation is currently in progress */
    isLoading: boolean;
}

/**
 * Props for the StatusIndicator component
 */
export interface StatusIndicatorProps {
    /** Whether undo operations are available */
    canUndo: boolean;
    /** Current position in the history */
    currentIndex: number;
}

/**
 * Return type for the useHistoryManager hook
 */
export interface HistoryManagerState {
    /** Current position in the history */
    currentIndex: number;
    /** Total number of history items */
    historyLength: number;
    /** Whether undo operations are available */
    canUndo: boolean;
    /** Whether redo operations are available */
    canRedo: boolean;
    /** Whether an undo operation is currently in progress */
    isUndoing: boolean;
    /** Whether a redo operation is currently in progress */
    isRedoing: boolean;
    /** Function to handle undo operations */
    handleUndo: () => Promise<void>;
    /** Function to handle redo operations */
    handleRedo: () => Promise<void>;
    /** Function to get history items for display */
    getHistoryItems: () => HistoryItem[];
}

/**
 * Platform detection utility type
 */
export type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
    /** The key combination (e.g., "⌘Z", "Ctrl+Z") */
    combination: string;
    /** Description of what the shortcut does */
    description: string;
    /** Whether the shortcut is currently available */
    available: boolean;
}
