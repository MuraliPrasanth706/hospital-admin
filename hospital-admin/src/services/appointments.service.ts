import { apiClient } from "@/src/lib/apiClient";

// ─── API shapes (what the backend actually returns) ───────────────────────────

export type ApiAppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "skipped";

export interface ApiAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_date: string;
  status: ApiAppointmentStatus;
  token: string;
  doctor_name: string;
  specialization: string;
  /** Available in the clinic-wide listing only */
  total_for_doctor?: number;
}

// ─── Service functions ────────────────────────────────────────────────────────

/** Admin: all appointments across the clinic (JWT must carry clinic_id). */
export async function getClinicAppointments(): Promise<ApiAppointment[]> {
  const { data } = await apiClient.get<ApiAppointment[]>("/appointments");
  return data;
}

/** Admin: appointments for a specific doctor within the clinic. */
export async function getAppointmentsByDoctor(
  doctorId: string,
): Promise<ApiAppointment[]> {
  const { data } = await apiClient.get<ApiAppointment[]>(
    `/appointments/doctor/${doctorId}`,
  );
  return data;
}

/** Public: track a single appointment by its UUID token. */
export async function trackAppointment(token: string): Promise<ApiAppointment> {
  const { data } = await apiClient.get<ApiAppointment>(
    `/appointments/track/${token}`,
  );
  return data;
}
