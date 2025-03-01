import { create } from 'zustand';

interface InsectFilterStore {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const useInsectFilter = create<InsectFilterStore>((set) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
}));