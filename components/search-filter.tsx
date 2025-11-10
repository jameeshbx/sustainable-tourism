"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  _count: {
    destinations: number;
  };
}

interface Category {
  id: string;
  name: string;
  _count: {
    destinations: number;
  };
  subcategories: Subcategory[];
}

interface SearchFilterProps {
  searchValue?: string;
  categoryValue?: string;
  subcategoryValue?: string;
  categories: Category[];
  searchPlaceholder?: string;
  categoryPlaceholder?: string;
  subcategoryPlaceholder?: string;
  submitButtonText?: string;
  className?: string;
}

export function SearchFilter({
  searchValue = "",
  categoryValue = "",
  subcategoryValue = "",
  categories,
  searchPlaceholder = "Search destinations...",
  categoryPlaceholder = "All categories",
  subcategoryPlaceholder = "All subcategories",
  submitButtonText = "Search",
  className = "",
}: SearchFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState(categoryValue || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoryValue || "all"
  );
  const [availableSubcategories, setAvailableSubcategories] = useState<
    Subcategory[]
  >([]);

  // Update available subcategories when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const category = categories.find((cat) => cat.id === selectedCategory);
      setAvailableSubcategories(category?.subcategories || []);
    } else {
      setAvailableSubcategories([]);
    }
    // Note: Subcategory reset is handled in handleCategoryChange to avoid infinite loops
  }, [selectedCategory]); // Removed categories from dependencies to prevent infinite loops

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Reset subcategory when category changes
    setSelectedSubcategory("all");
  };

  // Handle subcategory change
  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  return (
    <form
      method="GET"
      className={`space-y-4 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <Input
            id="search"
            name="search"
            placeholder={searchPlaceholder}
            defaultValue={searchValue}
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <Select
            name="category"
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={categoryPlaceholder} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category._count.destinations})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="subcategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subcategory
          </label>
          <Select
            name="subcategory"
            value={selectedSubcategory || "all"}
            onValueChange={handleSubcategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={subcategoryPlaceholder} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">All subcategories</SelectItem>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name} ({subcategory._count.destinations})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
}
