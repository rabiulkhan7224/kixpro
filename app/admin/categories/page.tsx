// app/admin/categories/page.tsx
import { Suspense } from "react";
import { getCategories } from "@/lib/actions/category";
import { DataTable } from "@/components/admin/Category/data-table";

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        }
      >
        <CategoriesTable />
      </Suspense>
    </div>
  );
}

// Separate async component to avoid blocking
async function CategoriesTable() {
  const categories = await getCategories();

  return <DataTable data={categories} />;
}
