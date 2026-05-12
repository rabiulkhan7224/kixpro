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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductFormValues, productSchema } from "@/types/product";

export default function ProductForm({
  mode = "create",
  product,
}: {
  mode?: "create" | "edit";
  product?: any;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image || null,
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      slug: product?.slug || "",
      description: product?.description || "",
      brandId: product?.brandId || "",
      categoryId: product?.categoryId || "",
      collectionId: product?.collectionId || "",
      image: product?.image || "",
    },
  });

  const handleUploadSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    if (url) {
      setImageUrl(url);
      form.setValue("image", url);
      toast.success("Image uploaded successfully!");
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    form.setValue("image", "");
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      console.log("Product Data:", values);
      toast.success(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated successfully!",
      );
      // Call your server action here later
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the form");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto py-10"
      >
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              placeholder="Premium Cotton T-Shirt"
              {...form.register("title")}
            />
            <FieldError>{form.formState.errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Slug</FieldLabel>
            <Input
              placeholder="premium-cotton-t-shirt"
              {...form.register("slug")}
            />
            <FieldError>{form.formState.errors.slug?.message}</FieldError>
          </Field>
        </div>

        {/* Description */}
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            rows={4}
            placeholder="Ultra-soft, breathable cotton tee..."
            {...form.register("description")}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>

        {/* Brand, Category, Collection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field>
            <FieldLabel>Brand</FieldLabel>
            <Select
              onValueChange={(value) => form.setValue("brandId", value)}
              defaultValue={form.watch("brandId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand1">ComfortWear</SelectItem>
                <SelectItem value="brand2">UrbanStyle</SelectItem>
                <SelectItem value="brand3">PremiumCo</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.brandId?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select
              onValueChange={(value) => form.setValue("categoryId", value)}
              defaultValue={form.watch("categoryId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caa91e35-9715-4259-9f52-35fb120e70fb">
                  T-Shirts
                </SelectItem>
                <SelectItem value="cat2">Jeans</SelectItem>
                <SelectItem value="cat3">Hoodies</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.categoryId?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Collection</FieldLabel>
            <Select
              onValueChange={(value) => form.setValue("collectionId", value)}
              defaultValue={form.watch("collectionId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="f3b5e8c3-1e9a-4c3a-a9b2-2d8e7d6a1f0c">
                  Summer 2026
                </SelectItem>
                <SelectItem value="col2">Winter Collection</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>
              {form.formState.errors.collectionId?.message}
            </FieldError>
          </Field>
        </div>

        {/* Image Upload */}
        <Field>
          <FieldLabel>Featured Image</FieldLabel>
          <FieldDescription>Upload main product image</FieldDescription>

          {!imageUrl && (
            <CldUploadButton
              uploadPreset="your_upload_preset" // ← Change this
              onSuccess={handleUploadSuccess}
              options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "png", "webp"],
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 hover:border-primary"
            >
              Click to upload image
            </CldUploadButton>
          )}

          {imageUrl && (
            <div className="relative inline-block mt-4">
              <Image
                src={imageUrl}
                alt="Product"
                width={300}
                height={300}
                className="rounded-xl object-cover border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <Input type="hidden" {...form.register("image")} />
        </Field>

        <Button type="submit" size="lg" className="w-full">
          {mode === "create" ? "Create Product" : "Update Product"}
        </Button>
      </form>
    </Form>
  );
}
