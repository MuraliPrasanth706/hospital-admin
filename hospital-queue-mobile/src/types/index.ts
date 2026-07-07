export interface Hospital {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  isOpen: boolean;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  specialty: string;
  rating: number;
  avgConsultMinutes: number;
  experienceYears: number;
  queueCount: number;
  estimatedWaitMinutes: number;
}

export interface QueueEntry {
  position: number;
  maskedName: string;
  token: string;
}

export interface Appointment {
  token: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  position: number;
  status: 'waiting' | 'in_progress' | 'completed' | 'emergency';
}

export type RootStackParamList = {
  Login: undefined;
  OTP: { phone: string };
  HospitalList: undefined;
  DoctorList: { clinicId: string; clinicName: string };
  BookAppointment: {
    doctorId: string;
    doctorName: string;
    specialty: string;
    queueCount: number;
    estimatedWait: number;
  };
  LiveQueue: {
    token: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    initialPosition: number;
  };
};
