import axios, { AxiosError } from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Request: attach stored auth token ───────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("queuecare_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response: handle 401 globally ───────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isAuthEndpoint
    ) {
      localStorage.removeItem("queuecare_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/** Extract a user-facing error message from any thrown value. */
export function extractApiError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    const msg = axiosErr.response?.data?.error;
    if (msg) return msg;
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred. Please try again.";
}
