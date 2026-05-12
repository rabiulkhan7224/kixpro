import z from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  collectionId: z.string().min(1, "Collection is required"),
  image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
