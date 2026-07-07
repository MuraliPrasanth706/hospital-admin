export const ROLES = {
  ADMIN: "admin",
  HOSPITAL_ADMIN: "hospital_admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};
export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};