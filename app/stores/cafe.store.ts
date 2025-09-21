import { create } from "zustand";

interface CafeState {
  name: string | null;
  setName: (name: string) => void;
}

export const useCafeStore = create<CafeState>((set) => ({
  name: null,
  setName: (name) => set({ name }),
}));
