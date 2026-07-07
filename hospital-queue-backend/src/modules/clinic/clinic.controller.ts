import { Request, Response } from "express";
import { createClinic, getClinics } from "./clinic.service";
import { handleControllerError } from "../../utils/commonMethod";

export const createClinicController = async (req: Request, res: Response) => {
	try {
		const clinic = await createClinic(req.body);
		res.status(201).json(clinic);
	} catch (e: unknown) {
		handleControllerError(res, e);
	}
};

export const getClinicsController = async (_req: Request, res: Response) => {
	try {
		const clinics = await getClinics();
		res.json(clinics);
	} catch (e: unknown) {
		handleControllerError(res, e);
	}
};
