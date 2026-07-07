import { create } from 'zustand';
import { Appointment } from '../types';

interface AppointmentState {
  current: Appointment | null;
  setAppointment: (appt: Appointment) => void;
  updatePosition: (position: number) => void;
  cancel: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  current: null,
  setAppointment: (appt) => set({ current: appt }),
  updatePosition: (position) =>
    set((state) => ({
      current: state.current ? { ...state.current, position } : null,
    })),
  cancel: () => set({ current: null }),
}));
