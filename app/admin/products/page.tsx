// app/(admin)/products/page.tsx
import { Suspense } from "react";
import { getProducts } from "@/lib/actions/product";
import type { ProductFilters } from "@/types/product";
import { ProductTable } from "@/components/admin/product/product-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  console.log(data);
  const currentPage = filters.page || 1;
  const currentLimit = filters.limit || 10;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductTable data={data} />
      </Suspense>
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/admin/products?page=${currentPage - 1}&limit=${currentLimit}`}
                />
              </PaginationItem>
            )}

            {Array.from({
              length: Math.ceil((meta?.total || 0) / currentLimit),
            }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`/admin/products?page=${pageNum}&limit=${currentLimit}`}
                    isActive={pageNum === currentPage}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {currentPage < Math.ceil((meta?.total || 0) / currentLimit) && (
              <PaginationItem>
                <PaginationNext
                  href={`/admin/products?page=${currentPage + 1}&limit=${currentLimit}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
