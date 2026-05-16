import z from "zod";

const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be a positive number"),
  compareAtPrice: z
    .number()
    .min(0, "Compare at price must be a positive number"),
  costPerItem: z.number().min(0, "Cost per item must be a positive number"),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  style: z.string().optional(),
  weight: z.number().min(0, "Weight must be a positive number").optional(),
  weightUnit: z.string().optional(),
  currency: z.string().optional(),
  barcode: z.string().optional(),
  taxable: z.boolean().optional(),
  optionValues: z
    .array(
      z
        .object({
          key: z.string(),
          value: z.string(),
        })
        .default({ key: "", value: "" }),
    )
    .optional(),

  inventory: z
    .object({
      quantity: z
        .number()
        .min(0, "Quantity must be a positive number")
        .optional(),
      lowStockThreshold: z
        .number()
        .min(0, "Low stock threshold must be a positive number")
        .optional(),
      allowBackorder: z.boolean().optional(),
    })
    .optional(),
});
export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  collectionId: z.string().min(1, "Collection is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  variants: variantSchema.array().min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Product = {
  title: string;
  description?: string;
  images?: string[];
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
  variants?: Variant[];
};

export type Variant = {
  sku: string;
  price: number;
  compareAtPrice: number;
  costPerItem: number;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  weight?: number;
  weightUnit?: string;
  currency?: string;
  barcode?: string;
  taxable?: boolean;
  optionValues?: Array<{ key: string; value: string }>;
  inventory?: Inventory;
  productId?: string;
};

export type Attributes = {};

export type Inventory = {
  quantity?: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
};
