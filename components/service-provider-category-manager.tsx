"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToastActions } from "@/lib/toast-actions";
import { Plus, X } from "lucide-react";

interface ServiceProviderCategoryManagerProps {
  serviceProvider: {
    id: string;
    name: string;
    businessName?: string;
    assignedCategories: Array<{
      id: string;
      category: {
        id: string;
        name: string;
      };
      subcategory?: {
        id: string;
        name: string;
      };
    }>;
  };
  categories: Array<{
    id: string;
    name: string;
    subcategories: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

export function ServiceProviderCategoryManager({
  serviceProvider,
  categories,
}: ServiceProviderCategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSuccess, handleError } = useToastActions();

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const handleAssignCategory = async () => {
    if (!selectedCategoryId) {
      handleError("Please select a category");
      return;
    }

    setIsLoading(true);
    try {
      // If no subcategories selected, assign just the category
      if (selectedSubcategoryIds.length === 0) {
        const response = await fetch(
          `/api/admin/service-providers/${serviceProvider.id}/categories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: selectedCategoryId,
              subcategoryId: null,
            }),
          }
        );

        if (response.ok) {
          handleSuccess("Category assigned successfully");
          window.location.reload();
        } else {
          const error = await response.json();
          handleError("Failed to assign category", error.error);
        }
      } else {
        // Assign category with each selected subcategory
        const promises = selectedSubcategoryIds.map((subcategoryId) =>
          fetch(
            `/api/admin/service-providers/${serviceProvider.id}/categories`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                categoryId: selectedCategoryId,
                subcategoryId: subcategoryId,
              }),
            }
          )
        );

        const responses = await Promise.all(promises);
        const allSuccessful = responses.every((response) => response.ok);

        if (allSuccessful) {
          handleSuccess("Category and subcategories assigned successfully");
          window.location.reload();
        } else {
          handleError("Some assignments failed", "Please try again.");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      handleError("Failed to assign categories", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (assignmentId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/service-providers/${serviceProvider.id}/categories?id=${assignmentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        handleSuccess("Category assignment removed successfully");
        window.location.reload();
      } else {
        const error = await response.json();
        handleError("Failed to remove category assignment", error.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      handleError("Failed to remove category assignment", "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          Assigned Categories
        </h4>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Assign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Category</DialogTitle>
              <DialogDescription>
                Assign a category and subcategory to{" "}
                {serviceProvider.businessName || serviceProvider.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={(value) => {
                    setSelectedCategoryId(value);
                    setSelectedSubcategoryIds([]);
                  }}
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

              {availableSubcategories.length > 0 && (
                <div>
                  <Label htmlFor="subcategories">
                    Subcategories (Optional)
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {availableSubcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`subcategory-${subcategory.id}`}
                          checked={selectedSubcategoryIds.includes(
                            subcategory.id
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSubcategoryIds((prev) => [
                                ...prev,
                                subcategory.id,
                              ]);
                            } else {
                              setSelectedSubcategoryIds((prev) =>
                                prev.filter((id) => id !== subcategory.id)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {subcategory.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSubcategoryIds.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedSubcategoryIds.length} subcategory(ies) selected
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignCategory}
                  disabled={isLoading || !selectedCategoryId}
                >
                  {isLoading ? "Assigning..." : "Assign Category"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {serviceProvider.assignedCategories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories assigned</p>
      ) : (
        <div className="space-y-2">
          {(() => {
            // Group assignments by category
            const groupedAssignments =
              serviceProvider.assignedCategories.reduce((acc, assignment) => {
                const categoryId = assignment.category.id;
                if (!acc[categoryId]) {
                  acc[categoryId] = {
                    category: assignment.category,
                    subcategories: [],
                    assignments: [],
                  };
                }
                if (assignment.subcategory) {
                  acc[categoryId].subcategories.push(assignment.subcategory);
                }
                acc[categoryId].assignments.push(assignment);
                return acc;
              }, {} as Record<string, { category: { id: string; name: string }; subcategories: { id: string; name: string }[]; assignments: { id: string }[] }>);

            return Object.values(groupedAssignments).map((group) => (
              <div
                key={group.category.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-sm">
                    {group.category.name}
                  </Badge>
                  <div className="flex space-x-1">
                    {group.assignments.map((assignment) => (
                      <Button
                        key={assignment.id}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveCategory(assignment.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                </div>
                {group.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {group.subcategories.map((subcategory) => (
                      <Badge
                        key={subcategory.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {subcategory.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
