// app/admin/products/[...slug]/page.tsx
import ProductForm from "@/components/admin/product/ProductForm";
import {
  getBrands,
  getCategories,
  getCollections,
} from "@/lib/actions/product";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

async function ProductFormContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { slug } = await params;
  const { id } = await searchParams;
  const action = slug[0]?.toLowerCase();

  const [brands, categories, collections] = await Promise.all([
    getBrands(),
    getCategories(),
    getCollections(),
  ]);

  // 1. CREATE NEW PRODUCT
  if (action === "new") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <ProductForm
          categories={categories}
          brands={brands}
          collections={collections}
          mode="create"
        />
      </div>
    );
  }

  // Require ID for edit, view, delete
  if (!id) {
    notFound();
  }

  // 2. VIEW PRODUCT (Read Only)
  if (action === "view") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Details</h1>
        {/* <ProductView product={product} /> */}
      </div>
    );
  }

  // 3. EDIT PRODUCT
  if (action === "edit") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        {/* <ProductForm mode="edit" product={product} /> */}
      </div>
    );
  }

  // 4. DELETE PRODUCT
  if (action === "delete") {
    return (
      <div className="p-6 max-w-md mx-auto">
        {/* <DeleteProductConfirm id={id} productName={product.name} /> */}
      </div>
    );
  }

  // Invalid route
  notFound();
}

export default async function ProductCatchAllPage({
  params,
  searchParams,
}: Props) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ProductFormContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
