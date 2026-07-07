import { Router } from "express";
import {
  loginController,
  registerAdminController,
  registerDoctorController,
  registerPatientController,
} from "./auth.controller";
import { authMiddleware, roleMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register-admin", registerAdminController);
router.post("/register-doctor", authMiddleware, roleMiddleware("admin"), registerDoctorController);
router.post("/register-patient", registerPatientController);
router.post("/login", loginController);

export default router;
