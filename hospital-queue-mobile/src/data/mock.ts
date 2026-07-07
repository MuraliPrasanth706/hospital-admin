import { Hospital, Doctor, QueueEntry } from '../types';

export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Apollo Care',
    address: 'MG Road, Bengaluru',
    rating: 4.8,
    distance: '1.2 km',
    isOpen: true,
  },
  {
    id: 'h2',
    name: 'Fortis Hospital',
    address: 'Cunningham Rd',
    rating: 4.7,
    distance: '2.4 km',
    isOpen: true,
  },
  {
    id: 'h3',
    name: 'Manipal Health',
    address: 'HSR Layout',
    rating: 4.6,
    distance: '3.1 km',
    isOpen: false,
  },
  {
    id: 'h4',
    name: 'Narayana Clinic',
    address: 'Indiranagar',
    rating: 4.9,
    distance: '4.0 km',
    isOpen: true,
  },
  {
    id: 'h5',
    name: 'Columbia Asia',
    address: 'Hebbal, Bengaluru',
    rating: 4.5,
    distance: '5.2 km',
    isOpen: true,
  },
];

export const doctors: Doctor[] = [
  {
    id: 'd1',
    clinicId: 'h1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cardiology',
    rating: 4.8,
    avgConsultMinutes: 12,
    experienceYears: 8,
    queueCount: 3,
    estimatedWaitMinutes: 36,
  },
  {
    id: 'd2',
    clinicId: 'h1',
    name: 'Dr. Rohan Verma',
    specialty: 'Dermatology',
    rating: 4.6,
    avgConsultMinutes: 10,
    experienceYears: 9,
    queueCount: 5,
    estimatedWaitMinutes: 50,
  },
  {
    id: 'd3',
    clinicId: 'h1',
    name: 'Dr. Meera Kapoor',
    specialty: 'Pediatrics',
    rating: 4.9,
    avgConsultMinutes: 15,
    experienceYears: 12,
    queueCount: 2,
    estimatedWaitMinutes: 30,
  },
  {
    id: 'd4',
    clinicId: 'h1',
    name: 'Dr. Nikhil Iyer',
    specialty: 'Orthopaedics',
    rating: 4.7,
    avgConsultMinutes: 20,
    experienceYears: 10,
    queueCount: 4,
    estimatedWaitMinutes: 80,
  },
  {
    id: 'd5',
    clinicId: 'h1',
    name: 'Dr. Priya Desai',
    specialty: 'Endocrinology',
    rating: 4.8,
    avgConsultMinutes: 9,
    experienceYears: 7,
    queueCount: 1,
    estimatedWaitMinutes: 9,
  },
  {
    id: 'd6',
    clinicId: 'h2',
    name: 'Dr. Arjun Nair',
    specialty: 'Neurology',
    rating: 4.9,
    avgConsultMinutes: 18,
    experienceYears: 15,
    queueCount: 6,
    estimatedWaitMinutes: 108,
  },
  {
    id: 'd7',
    clinicId: 'h2',
    name: 'Dr. Sunita Rao',
    specialty: 'Oncology',
    rating: 4.8,
    avgConsultMinutes: 25,
    experienceYears: 18,
    queueCount: 2,
    estimatedWaitMinutes: 50,
  },
];

export const upNextQueue: QueueEntry[] = [
  { position: 1, maskedName: 'A***ya', token: 'TKN-4819' },
  { position: 2, maskedName: 'R***an', token: 'TKN-4820' },
  { position: 3, maskedName: 'S***ta', token: 'TKN-4821' },
];

export const generateToken = (): string => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `TKN-${num}`;
};

export const formatDate = (date: Date = new Date()): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d} · ${m} · ${y}`;
};
