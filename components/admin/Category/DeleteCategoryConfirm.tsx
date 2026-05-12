"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/actions/category";
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

export default function DeleteCategoryConfirm({ id, name }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true); // Controlled state

  const handleDelete = async () => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
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
            <span className="font-medium">"{name}"</span> category and all
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Yes, Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
