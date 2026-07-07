import { Router } from "express";
import { createDoctorController, getDoctorsController, getDoctorsSummaryController } from "./doctor.controller";
import { authMiddleware, roleMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Admin only: add doctor
router.post("/", authMiddleware, roleMiddleware("admin"), createDoctorController);
// Public: list doctors by clinic (patient booking flow)
router.get("/", getDoctorsController);
// Admin only: doctors + appointment count
router.get("/summary", authMiddleware, roleMiddleware("admin"), getDoctorsSummaryController);

export default router;
