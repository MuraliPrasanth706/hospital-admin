import { Response } from "express";
import {
  bookAppointment,
  trackAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForClinic,
  getMyAppointmentsAsDoctor,
  getMyAppointmentsAsPatient,
  getLiveQueueForDoctor,
} from "./appointment.service";
import { handleControllerError } from "../../utils/commonMethod";
import { AuthRequest } from "../../middleware/auth.middleware";

// POST /appointments — patient books (patient_id = JWT userId)
export const bookAppointmentController = async (req: AuthRequest, res: Response) => {
  try {
    const patient_id = req.user!.userId;
    const appointment = await bookAppointment({ ...req.body, patient_id });
    res.status(201).json(appointment);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments/track/:token — anyone tracks by token
export const trackAppointmentController = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;
    const appointment = await trackAppointment(token);
    res.json(appointment);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments/mine — doctor sees only their appointments
export const getDoctorMyAppointmentsController = async (req: AuthRequest, res: Response) => {
  try {
    const doctor_id = req.user!.doctor_id!;
    const appointments = await getMyAppointmentsAsDoctor(doctor_id);
    res.json(appointments);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments/mine — patient sees only their bookings
export const getPatientMyAppointmentsController = async (req: AuthRequest, res: Response) => {
  try {
    const patient_id = req.user!.userId;
    const appointments = await getMyAppointmentsAsPatient(patient_id);
    res.json(appointments);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments — admin sees all clinic appointments
export const getClinicAppointmentsController = async (req: AuthRequest, res: Response) => {
  try {
    const clinic_id = req.user!.clinic_id!;
    const appointments = await getAppointmentsForClinic(clinic_id);
    res.json(appointments);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments/doctor/:doctor_id — admin sees one doctor's appointments
export const getAppointmentsByDoctorController = async (req: AuthRequest, res: Response) => {
  try {
    const clinic_id = req.user!.clinic_id!;
    const { doctor_id } = req.params;
    const appointments = await getAppointmentsForDoctor(doctor_id, clinic_id);
    res.json(appointments);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

// GET /appointments/queue/:doctor_id — public/patient queue tracker
export const getLiveQueueController = async (req: AuthRequest, res: Response) => {
  try {
    const { doctor_id } = req.params;
    const queue = await getLiveQueueForDoctor(doctor_id);
    res.json(queue);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};
