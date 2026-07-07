import { Router } from "express";
import {
  bookAppointmentController,
  trackAppointmentController,
  getAppointmentsByDoctorController,
  getClinicAppointmentsController,
  getDoctorMyAppointmentsController,
  getPatientMyAppointmentsController,
  getLiveQueueController,
} from "./appointment.controller";
import { authMiddleware, roleMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Patient: book — must be logged in as patient; patient_id taken from JWT
router.post("/", authMiddleware, roleMiddleware("patient"), bookAppointmentController);

// Anyone: track by token
router.get("/track/:token", trackAppointmentController);

// Anyone: view doctor queue
router.get("/queue/:doctor_id", getLiveQueueController);

// Doctor: only their own appointments
router.get("/mine", authMiddleware, roleMiddleware("doctor"), getDoctorMyAppointmentsController);

// Patient: only their own bookings
router.get("/my-bookings", authMiddleware, roleMiddleware("patient"), getPatientMyAppointmentsController);

// Admin: all appointments across their clinic
router.get("/", authMiddleware, roleMiddleware("admin"), getClinicAppointmentsController);

// Admin: one doctor's appointments (scoped to clinic via JWT)
router.get("/doctor/:doctor_id", authMiddleware, roleMiddleware("admin"), getAppointmentsByDoctorController);

export default router;
