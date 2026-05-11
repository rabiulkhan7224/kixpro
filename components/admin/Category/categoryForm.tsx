"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { X } from "lucide-react";
import { categorySchema } from "@/types/category";
import { createCategory } from "@/lib/actions/category";

export default function CategoryForm({
  mode,
  category,
}: {
  mode: "create" | "edit";
  category?: any;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    category?.image || null,
  );

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: category?.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      if (mode === "create") {
        await createCategory(values);
        toast.success("Category created successfully!");
      } else if (category?.id) {
        // await updateCategory(category.id, formData);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Handle successful Cloudinary upload
  const handleUploadSuccess = (result: any) => {
    const url = result.info.secure_url;
    setImageUrl(url);
    form.setValue("image", url, { shouldValidate: true });
    toast.success("Image uploaded successfully!");
  };

  // Remove uploaded image
  const removeImage = () => {
    setImageUrl(null);
    form.setValue("image", "", { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/* Name */}
        <Field>
          <FieldLabel htmlFor="name">Category Name</FieldLabel>
          <Input
            id="name"
            placeholder="Enter category name"
            {...form.register("name")}
          />
          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Enter category description"
            {...form.register("description")}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>

        {/* Image Upload */}
        <Field>
          <FieldLabel>Category Image</FieldLabel>
          <FieldDescription>Upload one image (JPG, PNG, WebP)</FieldDescription>

          {/* Upload Button */}
          {!imageUrl && (
            <CldUploadButton
              uploadPreset="kixpro" // ← Change this!
              onSuccess={handleUploadSuccess}
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                multiple: false,
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 text-center hover:border-primary transition-colors"
            >
              <div className="space-y-2">
                <p className="text-lg font-medium">Click to upload image</p>
                <p className="text-sm text-muted-foreground">
                  Max size: 4MB • Recommended: 1200x800
                </p>
              </div>
            </CldUploadButton>
          )}

          {/* Image Preview */}
          {imageUrl && (
            <div className="relative mt-4 inline-block">
              <Image
                src={imageUrl}
                alt="Uploaded category image"
                width={300}
                height={200}
                className="rounded-xl object-cover border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <FieldError>{form.formState.errors.image?.message}</FieldError>

          {/* Hidden input to keep value in form */}
          <Input type="hidden" {...form.register("image")} />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          {mode === "create" ? "Create Category" : "Update Category"}
        </Button>
      </form>
    </Form>
  );
}
