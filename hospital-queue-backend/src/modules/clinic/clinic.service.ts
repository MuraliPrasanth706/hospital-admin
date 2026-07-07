import { getAllClinics, createClinic as createClinicInRepo } from "./clinic.repo";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { validateRequiredField } from "../../utils/commonMethod";

export type CreateClinicInput = {
	name: string;
	address: string;
	admin_user_id: string;
};

export const createClinic = async (data: CreateClinicInput) => {
	validateRequiredField(data?.name, ERRORS.CLINIC_NAME_REQUIRED);
	validateRequiredField(data?.address, ERRORS.CLINIC_ADDRESS_REQUIRED);
	validateRequiredField(data?.admin_user_id, ERRORS.CLINIC_ADMIN_REQUIRED);

	return createClinicInRepo(data);
};

export const getClinics = async () => getAllClinics();