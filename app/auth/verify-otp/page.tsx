"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import AuthLayout from "@/app/auth/layout";
import OTPInput from "@/components/auth/OTPInput";

// import {
//   verifyOTP,
//   resendOTP,
// } from "@/services/auth";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    try {
      setLoading(true);

      // await verifyOTP(email, otp);

      toast.success("OTP verified.");

      router.push(
        `/auth/reset-password?email=${encodeURIComponent(
          email
        )}&otp=${otp}`
      );
    } catch (error) {
      console.error(error);

      toast.error("Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // await resendOTP(email);

      toast.success("OTP sent again.");

      setSeconds(60);
    } catch (error) {
      console.error(error);

      toast.error("Unable to resend OTP.");
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit verification code sent to your email."
    >
      <div className="space-y-8">

        <div className="rounded-xl bg-blue-50 p-4 text-center">

          <p className="text-sm text-slate-600">
            Verification code sent to
          </p>

          <p className="mt-1 font-semibold text-blue-700 break-all">
            {email}
          </p>

        </div>

        <OTPInput
          value={otp}
          onChange={setOtp}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
        >
          <ShieldCheck size={18} />

          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <div className="text-center">

          {seconds > 0 ? (

            <p className="text-sm text-slate-500">
              Resend OTP in{" "}
              <span className="font-semibold text-blue-600">
                {seconds}s
              </span>
            </p>

          ) : (

            <button
              onClick={handleResend}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <RotateCcw size={16} />

              Resend OTP
            </button>

          )}

        </div>

      </div>
    </AuthLayout>
  );
}