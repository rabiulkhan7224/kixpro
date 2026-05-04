"use server";

import { cookies } from "next/headers";
import {
  signupSchema,
  loginSchema,
  SignupFormValues,
  ApiSignupValues,
  apiSignupSchema,
  LoginFormValues,
} from "@/types/auth";
import { z } from "zod";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to set auth cookies
async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
  });
  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

// Signup action
export async function signupUser(data: ApiSignupValues) {
  // Server-side validation
  console.log("data", data);
  const result = apiSignupSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${API_BASE}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || "Signup failed" };
    }

    // If the API returns tokens immediately after signup, set them
    if (data.accessToken) {
      await setAuthCookies(data.accessToken, data.refreshToken);
    }

    return { success: true, data };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

// Login action
export async function login(data: LoginFormValues) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || "Invalid credentials" };
    }

    if (data.accessToken) {
      await setAuthCookies(data.accessToken, data.refreshToken);
    }

    return { success: true, data };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

// Logout action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  return { success: true };
}

// Get current user from token (optional)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user;
  } catch {
    return null;
  }
}
