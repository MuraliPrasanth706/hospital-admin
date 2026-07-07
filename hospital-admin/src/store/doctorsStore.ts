import { create } from "zustand";

interface DoctorsUiState {
  searchQuery: string;
  isModalOpen: boolean;

  setSearchQuery: (q: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * UI-only store for the Doctors page.
 * Server data (doctor list) is fetched directly in the page via useAsync.
 */
export const useDoctorsStore = create<DoctorsUiState>((set) => ({
  searchQuery: "",
  isModalOpen: false,

  setSearchQuery: (q) => set({ searchQuery: q }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
