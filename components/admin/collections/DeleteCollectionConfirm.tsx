"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCollection } from "@/lib/actions/collection";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  id: string;
  name: string;
};

export default function DeleteCollectionConfirm({ id, name }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true); // Controlled state

  const handleDelete = async () => {
    try {
      await deleteCollection(id);
      toast.success("Collection deleted successfully");
      router.push("/admin/collections");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collection");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Small delay to allow dialog to close before going back
    setTimeout(() => {
      router.back();
    }, 100);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-medium">"{name}"</span> collection and all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Yes, Delete Collection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
