import { create } from "zustand";
import { Stage as KonvaStage } from 'konva/lib/Stage'

interface CanvasStore {
    stage: KonvaStage | null;
    setStage: (stage: KonvaStage) => void;
}

/**
 * Global store for the Konva Stage reference.
 */
const useCanvasStore = create<CanvasStore>((set, get) => ({
    stage: null,
    setStage: (stage) => set({ stage }),
}))

export default useCanvasStore;