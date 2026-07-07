import { Request, Response } from "express";
import { login, registerAdmin, registerDoctor, registerPatient } from "./auth.services";
import { handleControllerError } from "../../utils/commonMethod";

export const registerAdminController = async (req: Request, res: Response) => {
  try {
    const user = await registerAdmin(req.body);
    res.status(201).json(user);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

export const registerDoctorController = async (req: Request, res: Response) => {
  try {
    const result = await registerDoctor(req.body);
    res.status(201).json(result);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

export const registerPatientController = async (req: Request, res: Response) => {
  try {
    const user = await registerPatient(req.body);
    res.status(201).json(user);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.phone;
    const { password } = req.body;
    const result = await login(identifier, password);
    res.json(result);
  } catch (e: unknown) {
    handleControllerError(res, e);
  }
};