import { query } from "../../config/db";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { AppError } from "../../utils/AppError";
import type { CreateClinicInput } from "./clinic.service";

export const createClinic = async (data: CreateClinicInput) => {
  try {
    const q = `
      INSERT INTO clinics (name, address, admin_user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await query(q, [
      data.name,
      data.address,
      data.admin_user_id,
    ]);
    return rows[0];
  } catch {
    throw new AppError(
      ERRORS.CLINIC_CREATE_FAILED.message,
      ERRORS.CLINIC_CREATE_FAILED.status,
      ERRORS.CLINIC_CREATE_FAILED.code,
    );
  }
};

export const getAllClinics = async () => {
  try {
    const { rows } = await query(`SELECT * FROM clinics`);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.CLINIC_FETCH_FAILED.message,
      ERRORS.CLINIC_FETCH_FAILED.status,
      ERRORS.CLINIC_FETCH_FAILED.code,
    );
  }
};