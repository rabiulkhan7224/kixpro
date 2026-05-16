"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { API_BASE } from "./base";

// ====================== FETCH DATA ======================

export async function getBrands() {
  try {
    const res = await fetch(`${API_BASE}/brand`, {
      cache: "no-store",
      next: { tags: ["brands"] },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("[Get Brands Error]", error);
    return [];
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      cache: "no-store",
      next: { tags: ["categories"] },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("[Get Categories Error]", error);
    return [];
  }
}

export async function getCollections() {
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      cache: "no-store",
      next: { tags: ["collections"] },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("[Get Collections Error]", error);
    return [];
  }
}

// ====================== CREATE PRODUCT ======================
export async function createProduct(data: any) {
  try {
    const res = await fetch(`${API_BASE}/products/with-variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    console.log(responseData);

    if (!responseData.success) {
      return {
        success: false,
        error:
          responseData.message ||
          responseData?.message?.[0] ||
          "Failed to create product",
      };
    }

    revalidatePath("/admin/products");
    revalidateTag("products", {});
    return { success: true, data: responseData };

    // redirect("/admin/products");
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) throw error;

    console.error("[Create Product Error]", error);
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}

// ====================== UPDATE PRODUCT ======================
export async function updateProduct(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: responseData.message || "Failed to update product",
      };
    }

    revalidatePath("/admin/products");
    revalidateTag("products", {});
    revalidatePath(`/admin/products/${id}`);

    redirect("/admin/products");
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) throw error;

    console.error("[Update Product Error]", error);
    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

// ====================== GET SINGLE PRODUCT ======================
export async function getProductById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("[Get Product Error]", error);
    return null;
  }
}
