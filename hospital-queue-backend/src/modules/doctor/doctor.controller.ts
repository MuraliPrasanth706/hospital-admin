import { Response } from "express";
import { createDoctor, getDoctors, getDoctorsWithCount } from "./doctor.service";
import { handleControllerError } from "../../utils/commonMethod";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createDoctorController = async (req: AuthRequest, res: Response) => {
  try {
    const clinic_id = req.user!.clinic_id!;
    const doctor = await createDoctor({ ...req.body, clinic_id });
    res.status(201).json(doctor);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

export const getDoctorsController = async (req: AuthRequest, res: Response) => {
  try {
    const clinic_id = req.query.clinic_id as string;
    const doctors = await getDoctors(clinic_id);
    res.json(doctors);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

export const getDoctorsSummaryController = async (req: AuthRequest, res: Response) => {
  try {
    const clinic_id = req.user!.clinic_id!;
    const summary = await getDoctorsWithCount(clinic_id);
    res.json(summary);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};
