"use server";

import { categoryFormValues, categorySchema } from "@/types/category";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { API_BASE } from "./base";

// ==================== HELPERS ====================
function handleRedirectError(error: unknown) {
  if (
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.includes("NEXT_REDIRECT")
  ) {
    throw error; // let Next.js handle redirects
  }
}

// ==================== CREATE CATEGORY ====================
export async function createCategory(data: categoryFormValues) {
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const responseData = await res.json().catch(() => ({})); // safe parse

    if (!res.ok) {
      return {
        success: false,
        error: responseData.message || "Failed to create category",
      };
    }

    revalidateTag("categories", {}); // provide profile/config to satisfy types
    // no revalidatePath – tags are enough
  } catch (error) {
    handleRedirectError(error); // re-throw redirects
    console.error("[Create Category Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }

  redirect("/admin/categories"); // only after successful try block
}

// ==================== UPDATE CATEGORY ====================
export async function updateCategory(id: string, data: categoryFormValues) {
  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: responseData.message || "Failed to update category",
      };
    }

    revalidateTag("categories", {});
    return { success: true, data: responseData };
  } catch (error) {
    handleRedirectError(error);
    console.error("[Update Category Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }

  redirect("/admin/categories");
}

// ==================== DELETE CATEGORY ====================
export async function deleteCategory(id: string) {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete category",
      };
    }

    revalidateTag("categories", {});
  } catch (error) {
    handleRedirectError(error);
    console.error("[Delete Category Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }

  redirect("/admin/categories");
}

// ==================== GET ALL CATEGORIES ====================
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      // For admin pages, no-store is fine; if you want cache + revalidation, just:
      next: { tags: ["categories"] },
      // cache: "no-store", // remove if you use tags
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error("[Get Categories Error]", error);
    return [];
  }
}

// ==================== GET SINGLE CATEGORY ====================
export async function getCategoryById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      next: { tags: ["categories"] },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("[Get Category By Id Error]", error);
    return null;
  }
}
