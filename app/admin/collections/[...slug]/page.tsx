import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import CollectionView from "@/components/admin/collections/CollectionView";
import { getCollectionById } from "@/lib/actions/collection";
import CollectionForm from "@/components/admin/collections/collectionForm";
import DeleteCollectionConfirm from "@/components/admin/collections/DeleteCollectionConfirm";

// ---------- Types ----------
type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string }>;
};

// ---------- Metadata ----------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const action = slug?.[0]?.toLowerCase();

  const titles: Record<string, string> = {
    new: "Add New Collection",
    view: "View Collection",
    edit: "Edit Collection",
    delete: "Delete Collection",
  };

  return {
    title: titles[action] ?? "Collections",
  };
}

// ---------- Page Component ----------
export default function CollectionPage(props: Props) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CollectionPageContent {...props} />
    </Suspense>
  );
}

// ---------- Async Content Component ----------
async function CollectionPageContent({ params, searchParams }: Props) {
  const [{ slug }, { id }] = await Promise.all([params, searchParams]);
  const action = slug?.[0]?.toLowerCase();

  // Action: Create
  if (action === "new") {
    return (
      <PageWrapper title="Add New Collection">
        <Suspense fallback={<FormLoadingFallback />}>
          <CollectionForm mode="create" />
        </Suspense>
      </PageWrapper>
    );
  }

  // All other actions require an ID
  if (!id) notFound();

  const collection = await getCollectionById(id);

  if (!collection) notFound();

  // Action: View
  if (action === "view") {
    return (
      <PageWrapper title={collection.name}>
        <CollectionView collection={collection} />
      </PageWrapper>
    );
  }

  // Action: Edit
  if (action === "edit") {
    return (
      <PageWrapper title={`Edit ${collection.name}`}>
        <Suspense fallback={<FormLoadingFallback />}>
          <CollectionForm mode="edit" collection={collection} />
        </Suspense>
      </PageWrapper>
    );
  }

  // Action: Delete
  if (action === "delete") {
    return (
      <PageWrapper title={`Delete ${collection.name}`}>
        <DeleteCollectionConfirm id={id} name={collection.name} />
      </PageWrapper>
    );
  }

  // Unknown action or empty slug → 404
  notFound();
}

// ---------- Reusable UI Helpers ----------
function PageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 max-w-4xl mx-auto overflow-y-auto h-screen">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  );
}

function LoadingFallback() {
  return <div className="p-20 text-center">Loading page...</div>;
}

function FormLoadingFallback() {
  return <div className="py-20 text-center">Loading form...</div>;
}
