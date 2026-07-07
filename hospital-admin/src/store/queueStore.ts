import { create } from "zustand";

interface QueueState {
  /** UUID of the currently selected doctor tab. Null before doctors load. */
  activeDoctorId: string | null;
  /**
   * Per-doctor delay adjustments in minutes (local UI state only).
   * Keyed by doctor UUID. Initialized to 0 when a doctor is first selected.
   */
  delays: Record<string, number>;

  setActiveDoctor: (id: string) => void;
  incrementDelay: (id: string, step?: number) => void;
  decrementDelay: (id: string, step?: number) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  activeDoctorId: null,
  delays: {},

  setActiveDoctor: (id) =>
    set((state) => ({
      activeDoctorId: id,
      // Initialise delay for this doctor if not yet set
      delays: id in state.delays ? state.delays : { ...state.delays, [id]: 0 },
    })),

  incrementDelay: (id, step = 5) =>
    set((state) => ({
      delays: { ...state.delays, [id]: (state.delays[id] ?? 0) + step },
    })),

  decrementDelay: (id, step = 5) =>
    set((state) => ({
      delays: {
        ...state.delays,
        [id]: Math.max(0, (state.delays[id] ?? 0) - step),
      },
    })),
}));
