"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileTextIcon,
  FileSpreadsheetIcon,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

// ---------- Types ----------
type Product = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  images: string[];
  category?: { id: string; name: string } | null;
  collection?: { id: string; name: string } | null;
  variants: Array<Record<string, any>>;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
};

// ---------- Component ----------
export function ProductTable({ data = [] }: { data?: Product[] }) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({ open: false, id: "", title: "" });

  // ---------- Columns Definition ----------
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.images;
        const src =
          Array.isArray(images) && images.length > 0 ? images[0] : null;
        return src ? (
          <Image
            src={src}
            alt={row.original.title}
            width={48}
            height={48}
            className="rounded-md object-cover border"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-50 truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (row) => row.category?.name ?? "—",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue() as string}
        </span>
      ),
    },
    {
      id: "collection",
      header: "Collection",
      accessorFn: (row) => row.collection?.name ?? "—",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "variants",
      header: "Variants",
      cell: ({ row }) => {
        const count = row.original.variants?.length ?? 0;
        return (
          <span className="text-sm">
            {count} variant{count !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      id: "price",
      header: "Price",
      accessorFn: (row) =>
        row.minPrice === row.maxPrice
          ? `$${row.minPrice.toFixed(2)}`
          : `$${row.minPrice.toFixed(2)} – $${row.maxPrice.toFixed(2)}`,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "totalStock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("totalStock") as number;
        return (
          <span className={stock === 0 ? "text-red-500" : ""}>{stock}</span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/products/view?id=${product.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/products/edit?id=${product.id}`)
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() =>
                  setDeleteDialog({
                    open: true,
                    id: product.id,
                    title: product.title,
                  })
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ---------- Table Instance ----------
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  });

  // ---------- Delete Handler ----------
  const handleDeleteConfirm = async () => {
    try {
      //   await deleteProduct(deleteDialog.id);
      toast.success("Product deleted successfully");
      setDeleteDialog({ open: false, id: "", title: "" });
      router.refresh(); // Refresh server component data
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  // ---------- Export Functions ----------
  const getExportData = () =>
    table.getFilteredRowModel().rows.map((row) => ({
      Title: row.original.title,
      Slug: row.original.slug,
      Category: row.original.category?.name ?? "",
      Collection: row.original.collection?.name ?? "",
      Variants: row.original.variants?.length ?? 0,
      "Min Price": row.original.minPrice,
      "Max Price": row.original.maxPrice,
      Stock: row.original.totalStock,
      Created: row.original.createdAt,
      Updated: row.original.updatedAt,
    }));

  const exportToCSV = () => {
    const data = getExportData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    const data = getExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(
      workbook,
      `products-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const exportToJSON = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `products-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <Input
          placeholder="Search products..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToCSV}>
              <FileTextIcon className="mr-2 size-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>
              <FileSpreadsheetIcon className="mr-2 size-4" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToJSON}>
              <FileTextIcon className="mr-2 size-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {table.getFilteredRowModel().rows.length} product(s)
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium">"{deleteDialog.title}"</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
