import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

// export type LoginFormValues = z.infer<typeof loginSchema>;

export type categoryFormValues = z.infer<typeof categorySchema>;
