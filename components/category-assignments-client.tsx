"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceProviderCategoryManager } from "@/components/service-provider-category-manager";
import { CategoryAssignmentOverview } from "@/components/category-assignment-overview";
import { Table, Grid } from "lucide-react";

interface ServiceProvider {
  id: string;
  name: string | null;
  businessName?: string | null;
  email: string;
  businessEmail?: string | null;
  isBusinessVerified: boolean;
  assignedCategories: Array<{
    id: string;
    category: {
      id: string;
      name: string;
    };
    subcategory?: {
      id: string;
      name: string;
    } | null;
  }>;
  _count: {
    destinations: number;
  };
}

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

interface CategoryAssignmentsClientProps {
  serviceProviders: ServiceProvider[];
  categories: Category[];
}

export function CategoryAssignmentsClient({
  serviceProviders,
  categories,
}: CategoryAssignmentsClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Service Provider Category Assignments
        </h3>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <CategoryAssignmentOverview
          serviceProviders={serviceProviders}
          categories={categories}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serviceProviders.map((serviceProvider) => (
            <Card key={serviceProvider.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {serviceProvider.businessName || serviceProvider.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {serviceProvider.businessEmail || serviceProvider.email}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-sm font-medium ${
                        serviceProvider.isBusinessVerified
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {serviceProvider.isBusinessVerified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Destinations:</span>
                    <span className="text-sm font-medium">
                      {serviceProvider._count.destinations}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Assigned Categories:
                    </span>
                    <span className="text-sm font-medium">
                      {serviceProvider.assignedCategories.length}
                    </span>
                  </div>
                </div>

                {/* Category Assignment Manager */}
                <div className="border-t pt-4">
                  <ServiceProviderCategoryManager
                    serviceProvider={{
                      ...serviceProvider,
                      name: serviceProvider.name || "Unknown",
                      businessName: serviceProvider.businessName || undefined,
                      assignedCategories:
                        serviceProvider.assignedCategories.map((ac) => ({
                          ...ac,
                          category: {
                            ...ac.category,
                            name: ac.category.name || "Unknown",
                          },
                          subcategory: ac.subcategory
                            ? {
                                ...ac.subcategory,
                                name: ac.subcategory.name || "Unknown",
                              }
                            : undefined,
                        })),
                    }}
                    categories={categories}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
