import { apiClient } from "@/src/lib/apiClient";

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface ApiDoctorSummary {
  id: string;
  name: string;
  specialization: string;
  appointment_count: number;
  experience_years: number;
  avg_consult_minutes: number;
}

export interface CreateDoctorPayload {
  name: string;
  specialization: string;
  experience_years?: number;
  avg_consult_minutes?: number;
}

export interface ApiDoctor {
  id: string;
  name: string;
  specialization: string;
  clinic_id: string;
  user_id: string | null;
  created_at: string;
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Admin: per-doctor summary with appointment counts.
 * clinic_id is derived from the JWT on the backend.
 */
export async function getDoctorsSummary(): Promise<ApiDoctorSummary[]> {
  const { data } =
    await apiClient.get<ApiDoctorSummary[]>("/doctors/summary");
  return data;
}

/**
 * Admin: create a new doctor.
 * clinic_id is injected from the JWT on the backend — do NOT send it here.
 */
export async function createDoctor(
  payload: CreateDoctorPayload,
): Promise<ApiDoctor> {
  const { data } = await apiClient.post<ApiDoctor>("/doctors", payload);
  return data;
}
