export interface JwtUser {
  userId: string;
  role: string;
  clinic_id?: string;
  doctor_id?: string;
}