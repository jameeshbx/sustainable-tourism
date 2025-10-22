"use client";

import { useState } from "react";
import Link from "next/link";
import { useToastActions } from "@/lib/toast-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Subcategory {
  id: string;
  name: string;
  _count: {
    destinations: number;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string | null;
  _count: {
    destinations: number;
  };
  subcategories: Subcategory[];
}

interface ExpandableCategoryProps {
  category: Category;
}

export function ExpandableCategory({ category }: ExpandableCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { handleInfo, handleError } = useToastActions();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      handleInfo(
        "Category expanded",
        `Viewing subcategories for ${category.name}`
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category._count.destinations} destinations
            </Badge>
            {category.subcategories.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {category.subcategories.length} subcategories
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/admin/categories/${category.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Link href={`/admin/categories/${category.id}/form-config`}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            </Link>
            <Link
              href={`/admin/categories/${category.id}/subcategories/create`}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subcategory
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <CardContent className="pt-0">
          {category.subcategories.length === 0 ? (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <p className="mb-3">No subcategories yet.</p>
              <Link
                href={`/admin/categories/${category.id}/subcategories/create`}
              >
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Subcategory
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {subcategory.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {subcategory._count.destinations}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Link
                        href={`/admin/categories/${category.id}/subcategories/${subcategory.id}/edit`}
                      >
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={async () => {
                          if (
                            confirm(
                              `Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`
                            )
                          ) {
                            try {
                              const response = await fetch(
                                `/api/categories/${category.id}/subcategories/${subcategory.id}`,
                                {
                                  method: "DELETE",
                                }
                              );

                              if (response.ok) {
                                handleInfo(
                                  "Subcategory deleted",
                                  `${subcategory.name} has been deleted`
                                );
                                window.location.reload();
                              } else {
                                const error = await response.json();
                                handleError(
                                  "Failed to delete subcategory",
                                  error.error
                                );
                              }
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (_error) {
                              handleError(
                                "Failed to delete subcategory",
                                "Please try again."
                              );
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
