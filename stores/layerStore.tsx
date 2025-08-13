import { HistoryManager } from "@/utils/historyManager";
import { create } from "zustand";
import { devtools } from 'zustand/middleware'
import { TextElement } from "@/types/index.type";
import { createLayerUpdateDebouncer } from "@/utils/debounce";

interface LayerStore {
    textLayers: TextElement[];
    selectedTextLayerId: string | null;
    historyManager: HistoryManager;
    isInitialized: boolean;
    textNodesMap: Map<string, any>; // Store Konva text node references
    initializeHistory: () => void;
    addTextLayer: (textLayer: TextElement) => void;
    removeTextLayer: (id: string) => void;
    updateTextLayer: (id: string, textLayer: Partial<TextElement>) => void;
    updateTextLayerImmediate: (id: string, textLayer: Partial<TextElement>) => void; // For immediate updates without history
    setSelectedTextLayerId: (id: string | null) => void;
    registerTextNode: (id: string, node: any) => void;
    unregisterTextNode: (id: string) => void;
    moveLayerUp: (id: string) => void;
    moveLayerDown: (id: string) => void;
    undo: () => void;
    redo: () => void;
    resetToInitial: () => void;
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    clearLocalStorage: () => void;
}

// Helper function for auto-saving to localStorage
/**
 * Persist current state to localStorage in a microtask to avoid blocking UI.
 */
const autoSave = (textLayers: TextElement[], selectedTextLayerId: string | null) => {
    setTimeout(() => {
        try {
            const dataToSave = {
                textLayers,
                selectedTextLayerId,
                timestamp: Date.now()
            };
            localStorage.setItem('image-text-composer-state', JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Failed to auto-save to localStorage:', error);
        }
    }, 0);
};

// Create a debouncer for layer updates
const layerUpdateDebouncer = createLayerUpdateDebouncer();

const useLayerStore = create<LayerStore>()(devtools((set, get) => ({
    textLayers: [],
    selectedTextLayerId: null,
    historyManager: new HistoryManager(),
    isInitialized: false,
    textNodesMap: new Map(),

    /**
     * Initialize the history manager with the current empty state
     * This should be called when the app loads
     */
    initializeHistory: () => set((state) => {
        if (!state.isInitialized) {
            state.historyManager.initialize(state.textLayers);
            return { isInitialized: true };
        }
        return state;
    }),

    addTextLayer: (textLayer: TextElement) => set((state) => {
        // Ensure history is initialized
        if (!state.isInitialized) {
            state.historyManager.initialize(state.textLayers);
        }

        const newTextLayers = [...state.textLayers, { ...textLayer }];
        state.historyManager.add(newTextLayers);
        
        // Auto-save to localStorage
        autoSave(newTextLayers, state.selectedTextLayerId);
        
        return { 
            textLayers: newTextLayers,
            isInitialized: true
        };
    }),

    removeTextLayer: (id: string) => set((state) => {
        // Ensure history is initialized
        if (!state.isInitialized) {
            state.historyManager.initialize(state.textLayers);
        }

        const newTextLayers = state.textLayers.filter((layer) => layer.id !== id);
        state.historyManager.add(newTextLayers);
        
        // Auto-save to localStorage
        autoSave(newTextLayers, state.selectedTextLayerId);
        
        return { 
            textLayers: newTextLayers,
            isInitialized: true
        };
    }),

    updateTextLayer: (id: string, textLayer: Partial<TextElement>) => set((state) => {
        // Ensure history is initialized
        if (!state.isInitialized) {
            state.historyManager.initialize(state.textLayers);
        }

        const updatedTextLayers = state.textLayers.map((layer) => 
            layer.id === id ? { ...layer, ...textLayer } : layer
        );
        
        state.historyManager.add(updatedTextLayers);
        
        // Auto-save to localStorage
        autoSave(updatedTextLayers, state.selectedTextLayerId);
        
        return { 
            textLayers: updatedTextLayers,
            isInitialized: true
        };
    }),

    // Immediate update without history (for real-time changes like dragging)
    updateTextLayerImmediate: (id: string, textLayer: Partial<TextElement>) => set((state) => {
        const updatedTextLayers = state.textLayers.map((layer) => 
            layer.id === id ? { ...layer, ...textLayer } : layer
        );
        
        return { 
            textLayers: updatedTextLayers
        };
    }),

    setSelectedTextLayerId: (id: string | null) => set(() => ({ selectedTextLayerId: id })),

    registerTextNode: (id: string, node: any) => set((state) => {
        state.textNodesMap.set(id, node);
        return { textNodesMap: new Map(state.textNodesMap) };
    }),

    unregisterTextNode: (id: string) => set((state) => {
        state.textNodesMap.delete(id);
        return { textNodesMap: new Map(state.textNodesMap) };
    }),

    moveLayerUp: (id: string) => set((state) => {
        const textNode = state.textNodesMap.get(id);
        if (textNode) {
            textNode.moveUp();
        }
        return { ...state };
    }),

    moveLayerDown: (id: string) => set((state) => {
        const textNode = state.textNodesMap.get(id);
        if (textNode) {
            textNode.moveDown();
        }
        return { ...state };
    }),

    undo: () => set((state) => {
        const newTextLayers = state.historyManager.undo();
        if (newTextLayers) {
            return { textLayers: newTextLayers };
        }
        return state;
    }),

    redo: () => set((state) => {
        const newTextLayers = state.historyManager.redo();
        if (newTextLayers) {
            return { textLayers: newTextLayers };
        }
        return state;
    }),

    /**
     * Reset to the initial empty state
     */
    resetToInitial: () => set((state) => {
        const initialTextLayers = state.historyManager.resetToInitial();
        return { 
            textLayers: initialTextLayers,
            selectedTextLayerId: null
        };
    }),

    /**
     * Save current state to localStorage
     */
    saveToLocalStorage: () => set((state) => {
        try {
            const dataToSave = {
                textLayers: state.textLayers,
                selectedTextLayerId: state.selectedTextLayerId,
                timestamp: Date.now()
            };
            localStorage.setItem('image-text-composer-state', JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
        return state;
    }),

    /**
     * Load state from localStorage
     */
    loadFromLocalStorage: () => set((state) => {
        try {
            const savedData = localStorage.getItem('image-text-composer-state');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Initialize history with loaded data
                state.historyManager.initialize(parsedData.textLayers || []);
                return {
                    textLayers: parsedData.textLayers || [],
                    selectedTextLayerId: parsedData.selectedTextLayerId || null,
                    isInitialized: true
                };
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
        return state;
    }),

    /**
     * Clear localStorage and reset to initial state
     */
    clearLocalStorage: () => set((state) => {
        try {
            localStorage.removeItem('image-text-composer-state');
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
        const initialTextLayers = state.historyManager.resetToInitial();
        return {
            textLayers: initialTextLayers,
            selectedTextLayerId: null
        };
    }),
})))

export default useLayerStore;       