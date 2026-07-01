"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import axios from "axios";

import {
  getProfile,
  type Profile,
} from "@/services/profile";
import api from "@/services/api";

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const logout = async () => {
  try {
    // পরে backend logout API থাকলে এখানে call হবে
    // await LogoutTeacher();
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    localStorage.removeItem("teacher_access_token");
    localStorage.removeItem("teacher_refresh_token");

    localStorage.removeItem("token");

    sessionStorage.clear();

    delete api.defaults.headers.common.Authorization;

    setProfile(null);

    router.replace("/auth/login");
  }
};

  const refreshProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        [401, 403].includes(
          error.response?.status ?? 0
        )
      ) {
        logout();
      }

      console.error(error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          localStorage.getItem(
            "teacher_access_token"
          ) ||
          localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getProfile();

        setProfile(data);
      } catch (error: unknown) {
        if (
          axios.isAxiosError(error) &&
          [401, 403].includes(
            error.response?.status ?? 0
          )
        ) {
          logout();
        }

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        refreshProfile,
        logout,
        isAuthenticated: !!profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
