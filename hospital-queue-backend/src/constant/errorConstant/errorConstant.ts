export const ERRORS = {
  USER_NOT_FOUND: {
    code: "AUTH_001",
    message: "User not found",
    status: 404,
  },
  INVALID_PASSWORD: {
    code: "AUTH_002",
    message: "Invalid password",
    status: 401,
  },
  UNAUTHORIZED: {
    code: "AUTH_003",
    message: "Unauthorized",
    status: 403,
  },
  FORBIDDEN: {
    code: "AUTH_006",
    message: "Access denied: insufficient role",
    status: 403,
  },
  INVALID_OR_EXPIRED_TOKEN: {
    code: "AUTH_004",
    message: "Invalid or expired token",
    status: 401,
  },
  TOKEN_EXPIRED: {
    code: "AUTH_005",
    message: "Token expired",
    status: 401,
  },
  CLINIC_NAME_REQUIRED: {
    code: "CLINIC_001",
    message: "Clinic name is required",
    status: 400,
  },
  CLINIC_ADDRESS_REQUIRED: {
    code: "CLINIC_002",
    message: "Clinic address is required",
    status: 400,
  },
  CLINIC_ADMIN_REQUIRED: {
    code: "CLINIC_003",
    message: "Admin user id is required",
    status: 400,
  },
  CLINIC_CREATE_FAILED: {
    code: "CLINIC_004",
    message: "Failed to create clinic",
    status: 500,
  },
  CLINIC_FETCH_FAILED: {
    code: "CLINIC_005",
    message: "Failed to fetch clinics",
    status: 500,
  },
  INTERNAL_SERVER_ERROR: {
    code: "COMMON_500",
    message: "Internal server error",
    status: 500,
  },
  DOCTOR_NAME_REQUIRED: {
    code: "DOCTOR_001",
    message: "Doctor name is required",
    status: 400,
  },
  DOCTOR_SPECIALIZATION_REQUIRED: {
    code: "DOCTOR_002",
    message: "Doctor specialization is required",
    status: 400,
  },
  DOCTOR_CLINIC_REQUIRED: {
    code: "DOCTOR_003",
    message: "Clinic id is required",
    status: 400,
  },
  DOCTOR_CREATE_FAILED: {
    code: "DOCTOR_004",
    message: "Failed to create doctor",
    status: 500,
  },
  DOCTOR_FETCH_FAILED: {
    code: "DOCTOR_005",
    message: "Failed to fetch doctors",
    status: 500,
  },
  DOCTOR_SUMMARY_FETCH_FAILED: {
    code: "DOCTOR_006",
    message: "Failed to fetch doctor summary",
    status: 500,
  },
  DOCTOR_CLINIC_MISSING: {
    code: "DOCTOR_007",
    message: "clinic_id is required",
    status: 400,
  },
  APPOINTMENT_PATIENT_REQUIRED: {
    code: "APPT_001",
    message: "patient_id is required",
    status: 400,
  },
  APPOINTMENT_DOCTOR_REQUIRED: {
    code: "APPT_002",
    message: "doctor_id is required",
    status: 400,
  },
  APPOINTMENT_DATE_REQUIRED: {
    code: "APPT_003",
    message: "appointment_date is required",
    status: 400,
  },
  APPOINTMENT_NOT_FOUND: {
    code: "APPT_004",
    message: "Appointment not found",
    status: 404,
  },
  APPOINTMENT_CREATE_FAILED: {
    code: "APPT_005",
    message: "Failed to create appointment",
    status: 500,
  },
  APPOINTMENT_FETCH_FAILED: {
    code: "APPT_006",
    message: "Failed to fetch appointments",
    status: 500,
  },

};

