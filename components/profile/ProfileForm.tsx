"use client";

import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/profile";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProfileFormState = {
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address: string;
  bio: string;
};

export default function ProfileForm() {
  const { profile } = useAuth();

  const [form, setForm] = useState<Partial<ProfileFormState>>({});

  const profileFormValues: ProfileFormState = {
    full_name: profile?.full_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone_number ?? "",
    gender: "",
    date_of_birth: "",
    address: profile?.address ?? "",
    bio: profile?.bio ?? "",
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const updatableFields: ProfileFormState = {
      full_name: form.full_name ?? profileFormValues.full_name,
      email: profileFormValues.email,
      phone: form.phone ?? profileFormValues.phone,
      gender: form.gender ?? profileFormValues.gender,
      date_of_birth:
        form.date_of_birth ?? profileFormValues.date_of_birth,
      address: form.address ?? profileFormValues.address,
      bio: form.bio ?? profileFormValues.bio,
    };

    updateProfile(updatableFields)
      .then((response) => {
        toast.success(
          response?.message || "Profile updated successfully!"
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred while updating profile.");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-l font-semibold text-slate-800">
        Personal Information
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Update your teacher profile information.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            value={form.full_name ?? profileFormValues.full_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={profileFormValues.email}
            readOnly
            disabled
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-2 py-2 pl-4 text-slate-500 outline-none transition"
            placeholder="john.doe@example.com"
          />
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone ?? profileFormValues.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
            placeholder="+8801XXXXXXXXX"
          />
        </div>

        {/* Gender */}

        {/* <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Gender
          </label>

          <select
            name="gender"
            value={form.gender ?? profileFormValues.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div> */}

        {/* DOB */}

        {/* <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date of Birth
          </label>

          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth ?? profileFormValues.date_of_birth}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
          />
        </div> */}

        {/* Address */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={form.address ?? profileFormValues.address}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
            placeholder="Dhaka, Bangladesh"
          />
        </div>

      </div>

      {/* Bio */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          About
        </label>

        <textarea
          rows={5}
          name="bio"
          value={form.bio ?? profileFormValues.bio}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 pl-4 px-2 py-2 outline-none transition focus:border-blue-500"
          placeholder="Tell students something about yourself..."
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          <Save size={14} />

          Save Changes
        </button>
      </div>
    </form>
  );
}