import AppSidebar from "@/components/dashboard/app-sidebar";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      }
    >
      <AppSidebar>{children}</AppSidebar>
    </Suspense>
  );
}
