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

export async function createProduct(data: any) {
  try {
    const res = await fetch(`${API_BASE}/products/with-variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    console.log("API Response", responseData);

    // 1. Handle HTTP Error status codes (400, 401, 500, etc.)
    if (!res.ok) {
      // Handle NestJS class-validator array errors vs generic errors
      const errorMessage = Array.isArray(responseData?.message)
        ? responseData.message.join(", ")
        : responseData?.message || "Failed to create product";

      return {
        success: false,
        error: errorMessage,
      };
    }

    // 2. Safely trigger revalidations now that we know res.ok is true
    revalidatePath("/admin/products");
    revalidateTag("products", "max"); // Fixed: removed the empty object {}

    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    // Keep this fallback to let Next.js handle redirects cleanly if you uncomment redirect()
    if (error?.digest?.includes("NEXT_REDIRECT")) throw error;

    console.error("[Create Product Error]", error);
    return {
      success: false,
      error: error.message || "An unexpected network error occurred",
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

// get products with pagination, search, filters
export async function getProducts(filters: any) {
  try {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.categoryId)
      queryParams.append("categoryId", filters.categoryId);
    if (filters.collectionId)
      queryParams.append("collectionId", filters.collectionId);
    if (filters.minPrice !== undefined)
      queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice !== undefined)
      queryParams.append("maxPrice", filters.maxPrice);
    if (filters.inStock !== undefined)
      queryParams.append("inStock", filters.inStock);

    const res = await fetch(`${API_BASE}/products?${queryParams.toString()}`, {
      cache: "no-store",
      next: { tags: ["products"] },
    });

    if (!res.ok) {
      return {
        data: [],
        meta: {
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: 0,
        },
      };
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("[Get Products Error]", error);
    return {
      product: [],
      meta: {
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 10,
        totalPages: 0,
      },
    };
  }
}
