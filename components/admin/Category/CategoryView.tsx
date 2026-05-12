import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

type CategoryViewProps = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function CategoryView({ category }: CategoryViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Category Details</h1>
          <p className="text-muted-foreground">View category information</p>
        </div>

        <div className="flex gap-3">
          <Link href={`/admin/categories/edit?id=${category.id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Link href={`/admin/categories/delete?id=${category.id}`}>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-8 space-y-8">
        {/* Image */}
        {category.image && (
          <div className="flex justify-center">
            <Image
              src={category.image}
              alt={category.name}
              width={400}
              height={250}
              className="rounded-xl object-cover border shadow-sm"
            />
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-xl font-semibold">{category.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Slug</p>
            <p className="font-mono text-sm">{category.slug}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-base leading-relaxed">
              {category.description || "No description provided."}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p>{new Date(category.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p>{new Date(category.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/admin/categories">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>
    </div>
  );
}
