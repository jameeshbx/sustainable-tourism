"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/lib/toast-actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicForm } from "@/components/dynamic-form";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
  formFields: {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    options?: string;
    order: number;
    width?: "half" | "full";
  }[];
}

interface DynamicDestinationFormProps {
  categories: Category[];
  initialData?: {
    name?: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    pickupLocation?: string;
    price?: number;
    imageUrl?: string;
    categoryId?: string;
    subcategoryId?: string;
    [key: string]: unknown;
  };
  onSubmit: (data: FormData) => void;
  submitText?: string;
  cancelHref: string;
}

export function DynamicDestinationForm({
  categories,
  initialData,
  onSubmit,
  submitText = "Create Destination",
  cancelHref,
}: DynamicDestinationFormProps) {
  const { handleError, handleAsyncAction } = useToastActions();
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.categoryId || ""
  );
  const [formData, setFormData] = useState<Record<string, unknown>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    pickupLocation: initialData?.pickupLocation || "",
    price: initialData?.price || "",
    imageUrl: initialData?.imageUrl || "",
    categoryId: initialData?.categoryId || "",
    subcategoryId: initialData?.subcategoryId || "",
    ...initialData,
  });

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (value instanceof File) {
            formDataObj.append(key, value);
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });

      await handleAsyncAction(
        () => Promise.resolve(onSubmit(formDataObj)),
        "Destination created successfully!",
        "Failed to create destination. Please try again.",
        "Creating destination..."
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      handleError(
        "Form submission failed",
        "Please check your inputs and try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection - Always Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              handleFieldChange("categoryId", value);
              handleFieldChange("subcategoryId", ""); // Reset subcategory
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subcategoryId">Subcategory *</Label>
          <Select
            value={String(formData.subcategoryId || "")}
            onValueChange={(value) => handleFieldChange("subcategoryId", value)}
            required
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategoryData?.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic Fields based on selected category */}
      {selectedCategoryData?.formFields &&
        selectedCategoryData.formFields.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Destination Information for {selectedCategoryData.name}
            </h3>
            <DynamicForm
              fields={selectedCategoryData.formFields}
              values={Object.fromEntries(
                Object.entries(formData).map(([key, value]) => [
                  key,
                  String(value || ""),
                ])
              )}
              onChange={handleFieldChange}
            />
          </div>
        )}

      {/* Show message if no form fields are configured */}
      {selectedCategory &&
        selectedCategoryData?.formFields &&
        selectedCategoryData.formFields.length === 0 && (
          <div className="border-t pt-6">
            <div className="text-center py-8 text-gray-500">
              <p>No form fields have been configured for this category yet.</p>
              <p className="text-sm mt-2">
                Please contact an administrator to configure the form fields for
                this category.
              </p>
            </div>
          </div>
        )}

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          {submitText}
        </Button>
        <Button type="button" variant="outline" className="flex-1" asChild>
          <a href={cancelHref}>Cancel</a>
        </Button>
      </div>
    </form>
  );
}
