import { AppError } from "./AppError";
import { Response } from "express";
import { ERRORS } from "../constant/errorConstant/errorConstant";

export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1] ?? null;
};

type ErrorDetail = {
  message: string;
  status: number;
  code?: string;
};

export const toAppError = (error: ErrorDetail): AppError => {
  return new AppError(error.message, error.status, error.code);
};

export const validateRequiredField = (
  value: string | null | undefined,
  error: ErrorDetail,
): void => {
  if (!value?.trim()) {
    throw toAppError(error);
  }
};

export const handleControllerError = (res: Response, error: unknown): void => {
  if (error instanceof AppError) {
    res.status(error.status).json({ error: error.message, code: error.code });
    return;
  }

  console.error("Unhandled controller error:", error);
  res.status(ERRORS.INTERNAL_SERVER_ERROR.status).json({
    error: ERRORS.INTERNAL_SERVER_ERROR.message,
    code: ERRORS.INTERNAL_SERVER_ERROR.code,
  });
};