import axios from 'axios';
import { Hospital, Doctor } from '../types';

// Use environment variable or fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const apiService = {
  getClinics: async (): Promise<Hospital[]> => {
    const { data } = await api.get('/clinics');
    // Map backend snake_case to mobile camelCase
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      address: c.address,
      rating: 4.5, // Default UI placeholder
      distance: '2.0 km', // Default UI placeholder
      isOpen: true,
    }));
  },

  getDoctorsByClinic: async (clinicId: string): Promise<Doctor[]> => {
    const { data } = await api.get(`/doctors?clinic_id=${clinicId}`);
    return data.map((d: any) => ({
      id: d.id,
      clinicId: d.clinic_id,
      name: d.name,
      specialty: d.specialization,
      rating: 4.8, // Default UI placeholder
      avgConsultMinutes: d.avg_consult_minutes,
      experienceYears: d.experience_years,
      queueCount: d.queue_count || 0, // Using the new field from backend update
      estimatedWaitMinutes: (d.queue_count || 0) * d.avg_consult_minutes,
    }));
  },

  registerPatient: async (phone: string) => {
    const { data } = await api.post('/auth/register-patient', {
      name: 'Patient',
      phone,
      password: 'demo_password', // Mock default password for our demo flow
    });
    return data;
  },

  loginPatient: async (phone: string) => {
    const { data } = await api.post('/auth/login', {
      identifier: phone,
      password: 'demo_password',
    });
    return data; // { token, role, clinic_id }
  },

  bookAppointment: async (doctorId: string, date: string, patientName: string) => {
    const { data } = await api.post('/appointments', {
      doctor_id: doctorId,
      appointment_date: date,
      patient_name: patientName,
    });
    return data;
  },

  getDoctorLiveQueue: async (doctorId: string) => {
    const { data } = await api.get(`/appointments/queue/${doctorId}`);
    return data;
  },
};
