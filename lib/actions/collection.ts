"use server";

import { collectionFormValues, collectionSchema } from "@/types/collection";
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

// ==================== CREATE Collection ====================
export async function createCollection(data: collectionFormValues) {
  const result = collectionSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const responseData = await res.json().catch(() => ({})); // safe parse

    if (!res.ok) {
      return {
        success: false,
        error: responseData.message || "Failed to create collection",
      };
    }

    revalidateTag("collections", {}); // provide profile/config to satisfy types
    // no revalidatePath – tags are enough
  } catch (error) {
    handleRedirectError(error); // re-throw redirects
    console.error("[Create Collection Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create collection",
    };
  }

  redirect("/admin/collections"); // only after successful try block
}

// ==================== UPDATE Collection====================
export async function updateCollection(id: string, data: collectionFormValues) {
  const result = collectionSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: responseData.message || "Failed to update collection",
      };
    }

    revalidateTag("collections", {});
    return { success: true, data: responseData };
  } catch (error) {
    handleRedirectError(error);
    console.error("[Update Collection Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update collection",
    };
  }

  redirect("/admin/collections");
}

// ==================== DELETE Collection ====================
export async function deleteCollection(id: string) {
  try {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete collection",
      };
    }

    revalidateTag("collections", {});
  } catch (error) {
    handleRedirectError(error);
    console.error("[Delete Collection Error]", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete collection",
    };
  }

  redirect("/admin/collections");
}

// ==================== GET ALL Collections ====================
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      // For admin pages, no-store is fine; if you want cache + revalidation, just:
      next: { tags: ["collections"] },
      // cache: "no-store", // remove if you use tags
    });

    if (!res.ok) throw new Error("Failed to fetch collections");
    return await res.json();
  } catch (error) {
    console.error("[Get Categories Error]", error);
    return [];
  }
}

// ==================== GET SINGLE Collection ====================
export async function getCollectionById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      next: { tags: ["collections"] },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("[Get Collection By Id Error]", error);
    return null;
  }
}
