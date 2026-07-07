import { query } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import type { CreateAppointmentInput } from "./appointment.service";

export const createAppointment = async (data: CreateAppointmentInput & { token: string }) => {
  try {
    // If a patient name is provided, update their name first
    if (data.patient_name) {
      await query(`UPDATE users SET name = $1 WHERE id = $2`, [data.patient_name, data.patient_id]);
    }

    const q = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, token, status)
      VALUES ($1, $2, $3, $4, 'scheduled')
      RETURNING *;
    `;
    const { rows } = await query(q, [
      data.patient_id,
      data.doctor_id,
      data.appointment_date,
      data.token,
    ]);
    return rows[0];
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_CREATE_FAILED.message,
      ERRORS.APPOINTMENT_CREATE_FAILED.status,
      ERRORS.APPOINTMENT_CREATE_FAILED.code,
    );
  }
};

export const getAppointmentByToken = async (token: string) => {
  try {
    const q = `
      SELECT a.*, d.name AS doctor_name, d.specialization, u.name AS patient_name
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE a.token = $1;
    `;
    const { rows } = await query(q, [token]);
    return rows[0] ?? null;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};

export const getAppointmentsByDoctor = async (doctor_id: string, clinic_id: string) => {
  try {
    const q = `
      SELECT a.id, a.patient_id, a.appointment_date, a.status, a.token,
             d.name AS doctor_name, d.clinic_id, u.name AS patient_name
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE a.doctor_id = $1
        AND d.clinic_id = $2
      ORDER BY a.appointment_date ASC;
    `;
    const { rows } = await query(q, [doctor_id, clinic_id]);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};

export const getAppointmentsByClinic = async (clinic_id: string) => {
  try {
    const q = `
      SELECT a.id, a.patient_id, a.appointment_date, a.status, a.token,
             d.name AS doctor_name, d.specialization, u.name AS patient_name,
             COUNT(*) OVER (PARTITION BY a.doctor_id)::int AS total_for_doctor
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE d.clinic_id = $1
      ORDER BY d.name, a.appointment_date ASC;
    `;
    const { rows } = await query(q, [clinic_id]);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};

// Doctor: see only their own appointments
export const getAppointmentsByDoctorUserId = async (doctor_id: string) => {
  try {
    const q = `
      SELECT a.id, a.patient_id, a.appointment_date, a.status, a.token,
             d.name AS doctor_name, d.specialization, u.name AS patient_name
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date ASC;
    `;
    const { rows } = await query(q, [doctor_id]);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};

// Patient: see only their own bookings
export const getAppointmentsByPatientId = async (patient_id: string) => {
  try {
    const q = `
      SELECT a.id, a.appointment_date, a.status, a.token,
             d.name AS doctor_name, d.specialization, u.name AS patient_name
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date ASC;
    `;
    const { rows } = await query(q, [patient_id]);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};

// Fetch live queue for a specific doctor today (in progress or waiting)
export const getLiveQueueForDoctorId = async (doctor_id: string) => {
  try {
    const q = `
      SELECT a.id, a.patient_id, a.appointment_date, a.status, a.token,
             u.name AS patient_name
      FROM appointments a
      JOIN users u ON u.id = a.patient_id
      WHERE a.doctor_id = $1
        AND a.appointment_date = CURRENT_DATE
        AND a.status IN ('scheduled', 'checked_in', 'in_progress')
      ORDER BY a.created_at ASC;
    `;
    const { rows } = await query(q, [doctor_id]);
    return rows;
  } catch {
    throw new AppError(
      ERRORS.APPOINTMENT_FETCH_FAILED.message,
      ERRORS.APPOINTMENT_FETCH_FAILED.status,
      ERRORS.APPOINTMENT_FETCH_FAILED.code,
    );
  }
};
