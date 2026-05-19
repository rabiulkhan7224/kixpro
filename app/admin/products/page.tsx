// app/(admin)/products/page.tsx
import { ProductsPageClient } from "@/components/admin/product/products-page-client";
import { getProducts } from "@/lib/actions/product";
import type { ProductFilters } from "@/types/product";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  // Resolve search params (can be async in Next.js 15)
  const params = await searchParams;

  // Build filters from URL
  const filters: ProductFilters = {
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
    sortOrder: (params.sortOrder as "ASC" | "DESC") || "DESC",
    search: params.search as string | undefined,
    categoryId: params.categoryId as string | undefined,
    collectionId: params.collectionId as string | undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStock: params.inStock === "true" ? true : undefined,
  };

  const { data, meta } = await getProducts(filters);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <Suspense
        fallback={<div className="p-20 text-center">Loading products...</div>}
      >
        <ProductsPageClient data={data} meta={meta} filters={filters} />
      </Suspense>
    </div>
  );
}
