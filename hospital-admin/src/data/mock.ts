import type { DemoAccount } from "@/src/types";

/**
 * Seeded credentials for the development backend.
 * See hospital-queue-backend/db/seed.sql for the source of truth.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    hospital: "Apollo Clinic - Bandra",
    email: "admin@apollo.com",
    password: "admin123",
  },
];
