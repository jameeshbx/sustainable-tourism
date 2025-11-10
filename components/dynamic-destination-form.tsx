"use client";

import { useState, useMemo, useCallback, useRef, memo, useEffect } from "react";
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

function DynamicDestinationFormComponent({
  categories: categoriesProp,
  initialData,
  onSubmit,
  submitText = "Create Destination",
  cancelHref,
}: DynamicDestinationFormProps) {
  const { handleError, handleAsyncAction } = useToastActions();

  // Stabilize categories array reference using useMemo
  // Create a stable key from category IDs to detect actual changes
  const categoriesKey = useMemo(
    () => categoriesProp.map((c) => c.id).join(","),
    [categoriesProp]
  );

  const stableCategories = useMemo(
    () => categoriesProp,
    [categoriesKey]
  );

  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.categoryId || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    initialData?.subcategoryId || ""
  );
  const [availableSubcategories, setAvailableSubcategories] = useState<
    { id: string; name: string }[]
  >([]);

  // Update available subcategories when category changes
  // Only update state if the array actually changed to avoid render churn
  useEffect(() => {
    const nextSubcategories = selectedCategory
      ? (stableCategories.find((c) => c.id === selectedCategory)?.subcategories || [])
      : [];

    const sameLength = availableSubcategories.length === nextSubcategories.length;
    const sameIds =
      sameLength &&
      availableSubcategories.every((s, i) => s.id === nextSubcategories[i]?.id);

    if (!sameIds) {
      setAvailableSubcategories(nextSubcategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]); // Intentionally exclude stableCategories to keep effect minimal

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

  // Find selected category data
  const selectedCategoryData = stableCategories.find((cat) => cat.id === selectedCategory);

  const handleFieldChange = useCallback((name: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Memoize handlers to keep them stable
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory((prev) => {
      if (prev === value) return prev;
      return value;
    });
    // Reset subcategory immediately on category change to keep controlled value valid
    setSelectedSubcategory("");
  }, []);

  const handleSubcategoryChange = useCallback((value: string) => {
    setSelectedSubcategory((prev) => {
      if (prev === value) return prev;
      return value;
    });
  }, []);

  // Memoize category items to prevent re-creation
  const categoryItems = useMemo(
    () =>
      stableCategories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      )),
    [stableCategories]
  );

  // Memoize subcategory items to prevent re-creation
  const subcategoryItems = useMemo(() => {
    if (!selectedCategory || availableSubcategories.length === 0) {
      return [
        <SelectItem key="no-options" value="no-options" disabled>
          {selectedCategory ? "No subcategories available" : "Select a category first"}
        </SelectItem>
      ];
    }
    return availableSubcategories.map((subcategory) => (
      <SelectItem key={subcategory.id} value={subcategory.id}>
        {subcategory.name}
      </SelectItem>
    ));
  }, [selectedCategory, availableSubcategories]);

  // Memoize the values object to prevent unnecessary re-renders
  // Use a ref to track if formData actually changed
  const lastFormDataRef = useRef(formData);
  const formValues = useMemo(() => {
    // Only recalculate if formData reference changed
    if (lastFormDataRef.current === formData) {
      return lastFormDataRef.current as Record<string, string>;
    }
    lastFormDataRef.current = formData;
    return Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        String(value || ""),
      ])
    );
  }, [formData]);

  // Don't memoize the JSX - create it inline to avoid React reconciliation issues
  // The key props will ensure React handles updates correctly

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      // Add all form data, including current Select values
      const finalFormData = {
        ...formData,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
      };

      Object.entries(finalFormData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          if (typeof value === "object" && (value as object) instanceof File) {
            formDataObj.append(key, value as File);
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
            value={selectedCategory || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryItems}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subcategoryId">Subcategory *</Label>
          <Select
            value={selectedSubcategory || ""}
            onValueChange={handleSubcategoryChange}
            disabled={!selectedCategory}
            key={selectedCategory || "no-category"}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedCategory ? "Select a subcategory" : "Select a category first"} />
            </SelectTrigger>
            <SelectContent>
              {subcategoryItems}
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
              values={formValues}
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

// Memoize the component to prevent unnecessary re-renders
export const DynamicDestinationForm = memo(DynamicDestinationFormComponent);
