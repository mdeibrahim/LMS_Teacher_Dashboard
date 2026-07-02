import api from "./api";

/* ===========================
   Register
=========================== */

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  phone_number: string;
}

export const RegisterTeacher = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register/",
    data
  );

  return response.data;
};

/* ===========================
   Login
=========================== */

export interface LoginPayload {
  email: string;
  password: string;
}

export const LoginTeacher = async (
  data: LoginPayload
) => {
  const response = await api.post(
    "/auth/login/",
    data
  );

  return response.data;
};

/* ===========================
   Forgot Password
=========================== */

export interface ForgotPasswordPayload {
  email: string;
}

export const ForgotPassword = async (
  data: ForgotPasswordPayload
) => {
  const response = await api.post(
    "/auth/forgot-password/",
    data
  );

  return response.data;
};

/* ===========================
   Verify OTP
=========================== */

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export const VerifyOTP = async (
  data: VerifyOTPPayload
) => {
  const response = await api.post(
    "/auth/verify-otp/",
    data
  );

  return response.data;
};

/* ===========================
   Resend OTP
=========================== */

export interface ResendOTPPayload {
  email: string;
  type: "register" | "forgot-password";
}

export const ResendOTP = async (
  data: ResendOTPPayload
) => {
  const response = await api.post(
    "/auth/resend-otp/",
    data
  );

  return response.data;
};

/* ===========================
   Reset Password
=========================== */

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirm_password: string;
}

export const ResetPassword = async (
  data: ResetPasswordPayload
) => {
  const response = await api.post(
    "/auth/reset-password/",
    data
  );

  return response.data;
};