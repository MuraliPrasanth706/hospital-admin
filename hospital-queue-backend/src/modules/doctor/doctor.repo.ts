import { query } from "../../config/db";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { AppError } from "../../utils/AppError";
import type { CreateDoctorInput } from "./doctor.service";

export const createDoctor = async (data: CreateDoctorInput) => {
  try {
    const q = `
      INSERT INTO doctors (name, specialization, clinic_id, experience_years, avg_consult_minutes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await query(q, [
      data.name,
      data.specialization,
      data.clinic_id,
      data.experience_years ?? 0,
      data.avg_consult_minutes ?? 10,
    ]);
    return rows[0];
  } catch {
    throw new AppError(
      ERRORS.DOCTOR_CREATE_FAILED.message,
      ERRORS.DOCTOR_CREATE_FAILED.status,
      ERRORS.DOCTOR_CREATE_FAILED.code,
    );
  }
};

export const getDoctorsByClinic = async (clinic_id: string) => {
  try {
    const { rows } = await query(
      `SELECT d.*, COUNT(a.id)::int as queue_count
       FROM doctors d
       LEFT JOIN appointments a ON a.doctor_id = d.id AND a.status = 'waiting'
       WHERE d.clinic_id = $1
       GROUP BY d.id`,
      [clinic_id],
    );
    return rows;
  } catch {
    throw new AppError(
      ERRORS.DOCTOR_FETCH_FAILED.message,
      ERRORS.DOCTOR_FETCH_FAILED.status,
      ERRORS.DOCTOR_FETCH_FAILED.code,
    );
  }
};

export const getDoctorsSummaryByClinic = async (clinic_id: string) => {
  try {
    const { rows } = await query(
      `SELECT d.id, d.name, d.specialization, d.experience_years, d.avg_consult_minutes,
              COUNT(a.id)::int AS appointment_count
       FROM doctors d
       LEFT JOIN appointments a ON a.doctor_id = d.id
       WHERE d.clinic_id = $1
       GROUP BY d.id, d.name, d.specialization, d.experience_years, d.avg_consult_minutes
       ORDER BY d.name`,
      [clinic_id],
    );
    return rows;
  } catch {
    throw new AppError(
      ERRORS.DOCTOR_SUMMARY_FETCH_FAILED.message,
      ERRORS.DOCTOR_SUMMARY_FETCH_FAILED.status,
      ERRORS.DOCTOR_SUMMARY_FETCH_FAILED.code,
    );
  }
};
