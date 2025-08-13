import { create } from "zustand";
import { FontOption } from "@/types/index.type";

interface FontsState {
  fonts: FontOption[] | null;
  hydrate: (fonts: FontOption[]) => void;
}

/**
 * Store for the list of available fonts, hydrated on app load.
 */
const useFontsStore = create<FontsState>((set) => ({
  fonts: null,
  hydrate: (fonts) => set({ fonts }),
}));

export default useFontsStore;