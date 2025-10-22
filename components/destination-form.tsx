"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface DestinationFormProps {
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
  };
  onSubmit: (data: FormData) => void;
  submitText?: string;
  cancelHref: string;
}

export function DestinationForm({
  categories,
  initialData,
  onSubmit,
  submitText = "Create Destination",
  cancelHref,
}: DestinationFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.categoryId || ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    initialData?.subcategoryId || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );
  const availableSubcategories = selectedCategory?.subcategories || [];

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategoryId !== initialData?.categoryId) {
      setSelectedSubcategoryId("");
    }
  }, [selectedCategoryId, initialData?.categoryId]);

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Destination Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter destination name"
            defaultValue={initialData?.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            placeholder="Enter location"
            defaultValue={initialData?.location}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter destination description"
          defaultValue={initialData?.description}
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            placeholder="Enter latitude"
            defaultValue={initialData?.latitude}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            placeholder="Enter longitude"
            defaultValue={initialData?.longitude}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupLocation">Pickup Location *</Label>
        <Input
          id="pickupLocation"
          name="pickupLocation"
          placeholder="Enter pickup location"
          defaultValue={initialData?.pickupLocation}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="Enter price"
          defaultValue={initialData?.price}
          required
        />
      </div>

      <ImageUpload
        onImageUpload={setImageUrl}
        currentImageUrl={imageUrl}
        label="Destination Image"
      />
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            name="categoryId"
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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

        <div className="space-y-2">
          <Label htmlFor="subcategoryId">Subcategory *</Label>
          <Select
            name="subcategoryId"
            value={selectedSubcategoryId}
            onValueChange={setSelectedSubcategoryId}
            required
            disabled={!selectedCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" asChild>
          <a href={cancelHref}>Cancel</a>
        </Button>
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );
}
