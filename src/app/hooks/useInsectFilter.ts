import { create } from 'zustand';

interface InsectFilterStore {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const useInsectFilter = create<InsectFilterStore>((set: (arg0: { isDrawerOpen: any; }) => any) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (open: any) => set({ isDrawerOpen: open }),
}));