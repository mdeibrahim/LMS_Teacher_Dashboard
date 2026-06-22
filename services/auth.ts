import api from "./api";

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


