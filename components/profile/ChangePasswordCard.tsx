"use client";

import { useState } from "react";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { passwordChange } from "@/services/profile";

export default function ChangePasswordCard() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

    if (form.new_password !== form.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    passwordChange(form)
      .then((response) => {
        toast.success(
          response?.message || "Password updated successfully."
        );

        setForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update password.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Lock
          className="text-blue-600"
          size={20}
        />

        <div>
          <h2 className="text-l font-semibold text-slate-800">
            Change Password
          </h2>

          <p className="text-sm text-slate-500">
            Update your account password.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        {/* Current Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Current Password
          </label>

          <input
            type="password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* New Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            New Password
          </label>

          <input
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-medium text-xs text-white transition hover:bg-blue-800"
        >
          <Save size={14} />

          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}