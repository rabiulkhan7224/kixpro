"use client";

import { useFieldArray, useForm, type Resolver } from "react-hook-form";
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
import { X, Upload, Trash2, Plus } from "lucide-react";
import { createProduct } from "@/lib/actions/product";
import { productSchema } from "@/types/product";
import Image from "next/image";

type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = {
  mode?: "create" | "edit";
  product?: Partial<ProductFormValues>;
  brands: any[];
  categories: any[];
  collections: any[];
};

// ---------- Variant Item Component ----------
function VariantItem({
  variant,
  vIndex,
  form,
  onRemove,
}: {
  variant: any;
  vIndex: number;
  form: any;
  onRemove: (index: number) => void;
}) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `variants.${vIndex}.optionValues`,
  });

  return (
    <div className="border p-6 rounded-lg relative bg-muted/30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => onRemove(vIndex)}
      >
        <Trash2 size={20} />
      </Button>

      <h3 className="font-semibold mb-6">Variant {vIndex + 1}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Basic fields */}
        <Field>
          <FieldLabel>SKU</FieldLabel>
          <Input {...form.register(`variants.${vIndex}.sku`)} />
        </Field>

        <Field>
          <FieldLabel>Price</FieldLabel>
          <Input
            type="number"
            step="0.01"
            {...form.register(`variants.${vIndex}.price`, {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field>
          <FieldLabel>Compare At Price</FieldLabel>
          <Input
            type="number"
            step="0.01"
            {...form.register(`variants.${vIndex}.compareAtPrice`, {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field>
          <FieldLabel>Cost Per Item</FieldLabel>
          <Input
            type="number"
            step="0.01"
            {...form.register(`variants.${vIndex}.costPerItem`, {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field>
          <FieldLabel>Size</FieldLabel>
          <Input
            placeholder="M, L, XL"
            {...form.register(`variants.${vIndex}.size`)}
          />
        </Field>

        <Field>
          <FieldLabel>Color</FieldLabel>
          <Input {...form.register(`variants.${vIndex}.color`)} />
        </Field>

        <Field>
          <FieldLabel>Material</FieldLabel>
          <Input {...form.register(`variants.${vIndex}.material`)} />
        </Field>

        <Field>
          <FieldLabel>Style</FieldLabel>
          <Input {...form.register(`variants.${vIndex}.style`)} />
        </Field>

        <Field>
          <FieldLabel>Weight</FieldLabel>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...form.register(`variants.${vIndex}.weight`, {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field>
          <FieldLabel>Weight Unit</FieldLabel>
          <Input
            placeholder="g, kg, lb"
            {...form.register(`variants.${vIndex}.weightUnit`)}
          />
        </Field>

        <Field>
          <FieldLabel>Barcode</FieldLabel>
          <Input {...form.register(`variants.${vIndex}.barcode`)} />
        </Field>

        <Field>
          <FieldLabel>Currency</FieldLabel>
          <Input
            placeholder="USD"
            {...form.register(`variants.${vIndex}.currency`)}
          />
        </Field>

        {/* Inventory */}
        <Field>
          <FieldLabel>Quantity</FieldLabel>
          <Input
            type="number"
            {...form.register(`variants.${vIndex}.inventory.quantity`, {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field>
          <FieldLabel>Low Stock Threshold</FieldLabel>
          <Input
            type="number"
            {...form.register(
              `variants.${vIndex}.inventory.lowStockThreshold`,
              {
                valueAsNumber: true,
              },
            )}
          />
        </Field>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`taxable-${vIndex}`}
            {...form.register(`variants.${vIndex}.taxable`)}
          />
          <label htmlFor={`taxable-${vIndex}`}>Taxable</label>
        </div>

        {/* Option Values (dynamic key‑value pairs) */}
        <div className="md:col-span-3 mt-4">
          <FieldLabel>Option Values</FieldLabel>
          <FieldDescription>
            Add attributes like Color, Size, Material etc.
          </FieldDescription>

          {optionFields.map((opt, optIndex) => (
            <div key={opt.id} className="flex gap-3 mt-3">
              <Input
                placeholder="Attribute (e.g. Color)"
                {...form.register(
                  `variants.${vIndex}.optionValues.${optIndex}.key`,
                )}
              />
              <Input
                placeholder="Value (e.g. Red)"
                {...form.register(
                  `variants.${vIndex}.optionValues.${optIndex}.value`,
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOption(optIndex)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => appendOption({ key: "", value: "" })}
          >
            <Plus size={16} className="mr-2" />
            Add Attribute
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main ProductForm ----------
export default function ProductForm({
  mode = "create",
  product,
  brands = [],
  categories = [],
  collections = [],
}: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const [showVariants, setShowVariants] = useState(true);

  // Full variant default – used for both initial and append
  const emptyVariant = {
    sku: "",
    price: 0,
    compareAtPrice: 0,
    costPerItem: 0,
    size: "",
    color: "",
    material: "",
    style: "",
    weight: 0,
    weightUnit: "g",
    currency: "USD",
    barcode: "",
    taxable: true,
    optionValues: [] as { key: string; value: string }[],
    inventory: {
      quantity: 0,
      lowStockThreshold: 5,
      allowBackorder: false,
    },
  };

  const defaultValues: ProductFormValues = {
    title: product?.title || "",
    description: product?.description || "",
    brandId: product?.brandId || "",
    categoryId: product?.categoryId || "",
    collectionId: product?.collectionId || "",
    images: product?.images || [],
    variants: (product?.variants as ProductFormValues["variants"]) || [
      emptyVariant,
    ],
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues,
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  // ✅ Fixed: functional state update avoids stale closure
  const handleUploadSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    if (url) {
      setImageUrls((prev) => {
        const newImages = [...prev, url];
        form.setValue("images", newImages, { shouldValidate: true });
        return newImages;
      });
      toast.success("Image uploaded successfully!");
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index);
      form.setValue("images", updatedImages, { shouldValidate: true });
      return updatedImages;
    });
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Transform optionValues from array to Record<string,string>
      const formattedValues = {
        ...values,
        variants: values.variants?.map((variant) => ({
          ...variant,
          optionValues: variant.optionValues?.reduce(
            (acc, item) => {
              if (item?.key && item?.value) {
                acc[item.key] = item.value;
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        })),
      };

      // ✅ Now submit the correct transformed data
      console.log("formattedValues", formattedValues);
      const result = await createProduct(formattedValues);
      console.log("api response", result);

      if (result?.success === false) {
        toast.error(result.error || "Failed to create product");
        return;
      }

      toast.success(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated!",
      );
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit form");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log("Validation Errors:", error);
          toast.error("Please fix the validation errors before submitting.");
        })}
        className="space-y-10 max-w-5xl mx-auto py-10"
      >
        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input
              placeholder="Premium Cotton T-Shirt"
              {...form.register("title")}
            />
            <FieldError>{form.formState.errors.title?.message}</FieldError>
          </Field>
        </div>

        {/* Description */}
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea rows={4} {...form.register("description")} />
        </Field>

        {/* Brand, Category, Collection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field>
            <FieldLabel>Brand</FieldLabel>
            <Select
              onValueChange={(v) => form.setValue("brandId", v)}
              defaultValue={form.watch("brandId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b: any) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.brandId?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select
              onValueChange={(v) => form.setValue("categoryId", v)}
              defaultValue={form.watch("categoryId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.categoryId?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Collection</FieldLabel>
            <Select
              onValueChange={(v) => form.setValue("collectionId", v)}
              defaultValue={form.watch("collectionId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>
              {form.formState.errors.collectionId?.message}
            </FieldError>
          </Field>
        </div>

        {/* Image Upload */}
        <Field>
          <FieldLabel>Product Images</FieldLabel>
          <FieldDescription>
            Upload multiple images (First image will be featured)
          </FieldDescription>

          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleUploadSuccess}
            options={{ maxFiles: 8, multiple: true }}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="font-medium">Click to upload multiple images</p>
            </div>
          </CldUploadButton>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-xl object-cover border aspect-square"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Input type="hidden" {...form.register("images")} />
          <FieldError>{form.formState.errors.images?.message}</FieldError>
        </Field>

        {/* Variants Section */}
        <div className="border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Variants</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVariants(!showVariants)}
            >
              {showVariants ? "Hide Variants" : "Show Variants"}
            </Button>
          </div>

          {showVariants && (
            <div className="space-y-8">
              {variantFields.map((variant, vIndex) => (
                <VariantItem
                  key={variant.id}
                  variant={variant}
                  vIndex={vIndex}
                  form={form}
                  onRemove={removeVariant}
                />
              ))}
              <FieldError>{form.formState.errors.variants?.message}</FieldError>

              <Button
                type="button"
                onClick={() => appendVariant(emptyVariant)} // ✅ now uses full default
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2" /> Add Another Variant
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full">
          {mode === "create" ? "Create Product" : "Update Product"}
        </Button>
      </form>
    </Form>
  );
}
