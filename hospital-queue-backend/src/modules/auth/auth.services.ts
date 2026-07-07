import { findUserByPhone, findUserByEmail, createUser, createDoctorUser } from "./auth.repo";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { ERRORS } from "../../constant/errorConstant/errorConstant";
import { ENV, ROLES } from "../../constant/commonConstant/commonConstant";
import { AppError } from "../../utils/AppError";

export const registerAdmin = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return createUser({ ...data, password: hashed, role: ROLES.ADMIN });
};

export const registerDoctor = async (data: {
  name: string;
  phone: string;
  password: string;
  specialization: string;
  clinic_id: string;
}) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return createDoctorUser({ ...data, password: hashed });
};

export const registerPatient = async (data: {
  name: string;
  phone: string;
  password: string;
}) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return createUser({ ...data, password: hashed, role: ROLES.PATIENT });
};

export const login = async (identifier: string, password: string) => {
  const user = identifier.includes('@') ? await findUserByEmail(identifier) : await findUserByPhone(identifier);
  if (!user)
    throw new AppError(
      ERRORS.USER_NOT_FOUND.message,
      ERRORS.USER_NOT_FOUND.status,
      ERRORS.USER_NOT_FOUND.code,
    );
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    throw new AppError(
      ERRORS.INVALID_PASSWORD.message,
      ERRORS.INVALID_PASSWORD.status,
      ERRORS.INVALID_PASSWORD.code,
    );

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      clinic_id: user.clinic_id ?? undefined,
      doctor_id: user.doctor_id ?? undefined,
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"] },
  );
  return { token, role: user.role, clinic_id: user.clinic_id ?? undefined };
};
