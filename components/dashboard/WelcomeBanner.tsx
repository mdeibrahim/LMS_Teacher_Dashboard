"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getProfile, type Profile } from "@/services/profile";

export default function WelcomeBanner() {
  const router = useRouter();


  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("teacher_access_token") ||
        localStorage.getItem("token");

      if (!token) {
        setProfile(null);
        setLoading(false);
        router.replace("/auth/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("teacher_access_token");
          localStorage.removeItem("token");
          router.replace("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [router]);

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-100 to-cyan-100 p-10">
      <span className="inline-block text-xs bg-white px-3 py-1 rounded-full text-blue-600 ">
        TEACHING COMMAND CENTER
      </span>

      <h1 className="text-3xl font-bold mt-5">
        Welcome back, &nbsp;
        <span className="text-blue-600">
          {loading ? "Loading..." : profile?.full_name || "Sarah Jenkins"}
        </span>
      </h1>

      <p className="text-gray-600 mt-5 text-xs max-w-2xl">
        Your dashboard is ready. You have 12 courses
        pending review and your students average
        completion rate is up by 8% this week.
      </p>
    </div>
  );
}