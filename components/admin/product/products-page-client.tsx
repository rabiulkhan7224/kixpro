// app/(admin)/products/products-page-client.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductTable } from "@/components/admin/product/product-table";
import type {
  Product,
  ProductFilters,
  Item,
  PaginationMeta,
} from "@/types/product";

interface Props {
  data: Item[];
  meta: PaginationMeta;
  filters: ProductFilters;
}

export function ProductsPageClient({ data, meta, filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // reset to first page on search
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <ProductTable
      data={data}
      meta={meta}
      filters={filters}
      onSearch={updateSearch}
      onPageChange={updatePage}
    />
  );
}
