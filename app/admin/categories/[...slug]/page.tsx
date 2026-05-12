// app/admin/categories/[...slug]/page.tsx
import CategoryForm from "@/components/admin/Category/categoryForm";
import CategoryView from "@/components/admin/Category/CategoryView";
import DeleteCategoryConfirm from "@/components/admin/Category/DeleteCategoryConfirm";
import { getCategoryById } from "@/lib/actions/category";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

export default function CategoryCatchAllPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <CategoryPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// Separate Client Component to handle async params
async function CategoryPageContent({ params, searchParams }: Props) {
  const { slug } = await params;
  const { id } = await searchParams;

  const action = slug[0]?.toLowerCase();

  // CREATE
  if (action === "new") {
    return (
      <div className="p-6 max-w-4xl mx-auto overflow-scroll h-screen">
        <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
        <Suspense
          fallback={<div className="py-20 text-center">Loading form...</div>}
        >
          <CategoryForm mode="create" />
        </Suspense>
      </div>
    );
  }

  if (!id) notFound();

  // Fetch category
  const category = await getCategoryById(id);
  console.log(category);

  if (!category) notFound();

  // VIEW
  if (action === "view") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <CategoryView category={category} />
      </div>
    );
  }

  // EDIT
  if (action === "edit") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
        <Suspense
          fallback={<div className="py-20 text-center">Loading form...</div>}
        >
          <CategoryForm mode="edit" category={category} />
        </Suspense>
      </div>
    );
  }

  // DELETE
  if (action === "delete") {
    return <DeleteCategoryConfirm id={id} name={category.name} />;
  }

  notFound();
}
