import { create } from "zustand";

interface SearchStore {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    searchQuery: "",
    setSearchQuery: (value) => set({ searchQuery: value }),
}));
