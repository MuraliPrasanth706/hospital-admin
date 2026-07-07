import { Router } from "express";
import {
	createClinicController,
	getClinicsController,
} from "./clinic.controller";

const router = Router();

router.post("/", createClinicController);
router.get("/", getClinicsController);

export default router;
