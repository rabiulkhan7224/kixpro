"use server";

import {
  apiSignupSchema,
  ApiSignupValues,
  LoginFormValues,
  loginSchema,
  User,
} from "@/types/auth";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to set auth cookies
async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  if (refreshToken) {
    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

// Signup
export async function signupUser(data: ApiSignupValues) {
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

    const responseData = await res.json();

    if (!res.ok) {
      return { error: responseData.message || "Signup failed" };
    }

    if (responseData.accessToken) {
      await setAuthCookies(responseData.accessToken, responseData.refreshToken);
      revalidateTag("user", "max");
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Login
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

    const responseData = await res.json();

    if (!res.ok) {
      return { error: responseData.message || "Invalid credentials" };
    }

    if (responseData.accessToken) {
      await setAuthCookies(responseData.accessToken, responseData.refreshToken);
      revalidateTag("user", "max");
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Get Current User
export async function getUser(): Promise<User | null> {
  try {
    await connection();

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      next: { tags: ["user"] },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

// Logout - Fixed Version
export async function logout() {
  const cookieStore = await cookies();

  // Proper cookie deletion
  // cookieStore.delete({
  //   name: "access_token",
  //   path: "/",
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  // });

  // cookieStore.delete({
  //   name: "refresh_token",
  //   path: "/",
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  // });

  cookieStore.set({
    name: "access_token",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set({
    name: "refresh_token",
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  revalidateTag("user", "max");

  // Redirect after logout (best practice)
  redirect("/");
}
