// app/admin/products/[...slug]/page.tsx
import ProductForm from "@/components/admin/product/ProductForm";
import { notFound } from "next/navigation";
// import ProductForm from "@/components/admin/ProductForm";
// import ProductView from "@/components/admin/ProductView";
// import DeleteProductConfirm from "@/components/admin/DeleteProductConfirm";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

export default async function ProductCatchAllPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { id } = await searchParams;

  const action = slug[0]?.toLowerCase();

  // 1. CREATE NEW PRODUCT
  if (action === "new") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <ProductForm mode="create" />
      </div>
    );
  }

  // Require ID for edit, view, delete
  if (!id) {
    notFound();
  }

  // Fetch product once (for edit, view, delete)
  // const product = await getProductById(id);
  const product = null; // ← Replace with your actual data fetching

  if (!product) {
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
