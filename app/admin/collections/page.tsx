import { Suspense } from "react";
import { CollectionTable } from "@/components/admin/collections/collectionTable";
import { getCollections } from "@/lib/actions/product";
import { notFound } from "next/navigation";

// 1️⃣ Keep the page component synchronous – no async
export default function CollectionPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CollectionTableWrapper />
    </Suspense>
  );
}

async function CollectionTableWrapper() {
  const collections = await getCollections();

  if (!collections || collections.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No collections found.</p>
      </div>
    );
  }

  return <CollectionTable data={collections} />;
}

// 3️⃣ Clean loading fallback
function LoadingState() {
  return (
    <div className="flex h-96 items-center justify-center">
      <p className="text-muted-foreground animate-pulse">
        Loading collections...
      </p>
    </div>
  );
}
