// ─── Appointment & Queue ──────────────────────────────────────────────────────

export type AppointmentStatus =
  | "In Progress"
  | "Waiting"
  | "Emergency"
  | "Completed";

export interface Appointment {
  /** Short display token, e.g. "A3F2B1C0" */
  token: string;
  patientName: string;
  patientInitial: string;
  doctorName: string;
  position: string;
  eta: string;
  status: AppointmentStatus;
  /** ISO date from backend, e.g. "2026-04-18" */
  appointmentDate?: string;
}

export interface QueuePatient {
  position: number;
  name: string;
  token: string;
  eta: string;
}

export interface CurrentPatient {
  name: string;
  token: string;
  phone: string;
  initial: string;
}

export interface QueueStats {
  inConsultation: number;
  waiting: number;
  completed: number;
  delay: number;
}

export interface DoctorQueue {
  stats: QueueStats;
  current: CurrentPatient;
  upNext: QueuePatient[];
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  initial: string;
  name: string;
  specialty: string;
  /** Not available from current API — defaults to 0 */
  rating: number;
  /** Not available from current API — defaults to 0 */
  experienceYears: number;
  inQueue: number;
  /** Not available from current API — defaults to 10 */
  avgConsultMinutes: number;
}

export interface AddDoctorFormValues {
  name: string;
  specialty: string;
  avgConsultMinutes: string;
  experienceYears: string;
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string | number;
  subLabel: string;
  dotColor: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface DemoAccount {
  hospital: string;
  email: string;
  password: string;
}
