import z from "zod";

export const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type collectionFormValues = z.infer<typeof collectionSchema>;
