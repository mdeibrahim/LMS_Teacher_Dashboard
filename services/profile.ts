import api from "./api";

export interface Profile {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  profile_picture: string | null;
  teacher_institution: string | null;
  teacher_subject: string | null;
  teacher_experience_years: number | null;
  date_joined: string;
}

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get("/profile/");
  return response.data;
};