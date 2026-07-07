import { createDoctor as createDoctorInRepo, getDoctorsByClinic, getDoctorsSummaryByClinic } from "./doctor.repo";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { validateRequiredField } from "../../utils/commonMethod";

export type CreateDoctorInput = {
  name: string;
  specialization: string;
  clinic_id: string;
  experience_years?: number;
  avg_consult_minutes?: number;
};

export const createDoctor = async (data: CreateDoctorInput) => {
  validateRequiredField(data?.name, ERRORS.DOCTOR_NAME_REQUIRED);
  validateRequiredField(data?.specialization, ERRORS.DOCTOR_SPECIALIZATION_REQUIRED);
  validateRequiredField(data?.clinic_id, ERRORS.DOCTOR_CLINIC_REQUIRED);

  return createDoctorInRepo(data);
};

export const getDoctors = async (clinic_id: string) => {
  validateRequiredField(clinic_id, ERRORS.DOCTOR_CLINIC_MISSING);
  return getDoctorsByClinic(clinic_id);
};

export const getDoctorsWithCount = async (clinic_id: string) => {
  validateRequiredField(clinic_id, ERRORS.DOCTOR_CLINIC_MISSING);
  return getDoctorsSummaryByClinic(clinic_id);
};
