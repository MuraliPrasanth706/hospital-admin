import { v4 as uuidv4 } from "uuid";
import {
  createAppointment as createAppointmentInRepo,
  getAppointmentByToken,
  getAppointmentsByDoctor,
  getAppointmentsByClinic,
  getAppointmentsByDoctorUserId,
  getAppointmentsByPatientId,
  getLiveQueueForDoctorId,
} from "./appointment.repo";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { validateRequiredField } from "../../utils/commonMethod";
import { AppError } from "../../utils/AppError";

export type CreateAppointmentInput = {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  patient_name?: string;
};

export const bookAppointment = async (data: CreateAppointmentInput) => {
  validateRequiredField(data?.patient_id, ERRORS.APPOINTMENT_PATIENT_REQUIRED);
  validateRequiredField(data?.doctor_id, ERRORS.APPOINTMENT_DOCTOR_REQUIRED);
  validateRequiredField(data?.appointment_date, ERRORS.APPOINTMENT_DATE_REQUIRED);

  const token = uuidv4();
  return createAppointmentInRepo({ ...data, token });
};

export const trackAppointment = async (token: string) => {
  const appointment = await getAppointmentByToken(token);
  if (!appointment) {
    throw new AppError(
      ERRORS.APPOINTMENT_NOT_FOUND.message,
      ERRORS.APPOINTMENT_NOT_FOUND.status,
      ERRORS.APPOINTMENT_NOT_FOUND.code,
    );
  }
  return appointment;
};

export const getAppointmentsForDoctor = async (
  doctor_id: string,
  clinic_id: string,
) => {
  validateRequiredField(doctor_id, ERRORS.APPOINTMENT_DOCTOR_REQUIRED);
  return getAppointmentsByDoctor(doctor_id, clinic_id);
};

export const getAppointmentsForClinic = async (clinic_id: string) =>
  getAppointmentsByClinic(clinic_id);

// Doctor: their own appointments from JWT doctor_id
export const getMyAppointmentsAsDoctor = async (doctor_id: string) =>
  getAppointmentsByDoctorUserId(doctor_id);

// Patient: their own bookings from JWT userId
export const getMyAppointmentsAsPatient = async (patient_id: string) =>
  getAppointmentsByPatientId(patient_id);

export const getLiveQueueForDoctor = async (doctor_id: string) =>
  getLiveQueueForDoctorId(doctor_id);
