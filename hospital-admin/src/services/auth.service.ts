import { apiClient } from "@/src/lib/apiClient";

// ─── Request / Response types ─────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  clinic_id?: string;
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function loginWithEmail(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    payload,
  );
  return data;
}
