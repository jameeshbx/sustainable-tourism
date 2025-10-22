"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToastActions } from "@/lib/toast-actions";
import { Search, Filter, X } from "lucide-react";

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

interface CategoryAssignmentOverviewProps {
  serviceProviders: ServiceProvider[];
  categories: Category[];
}

export function CategoryAssignmentOverview({
  serviceProviders,
  categories,
}: CategoryAssignmentOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showUnassigned, setShowUnassigned] = useState(false);
  const { handleSuccess, handleError } = useToastActions();

  // Filter service providers based on search and filters
  const filteredServiceProviders = serviceProviders.filter((sp) => {
    const matchesSearch =
      sp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      sp.assignedCategories.some((ac) => ac.category.id === selectedCategory);

    const matchesUnassigned =
      !showUnassigned || sp.assignedCategories.length === 0;

    return matchesSearch && matchesCategory && matchesUnassigned;
  });

  const handleRemoveAssignment = async (
    assignmentId: string,
    serviceProviderId: string
  ) => {
    try {
      const response = await fetch(
        `/api/admin/service-providers/${serviceProviderId}/categories?id=${assignmentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        handleSuccess(
          "Assignment removed",
          "Category assignment has been removed"
        );
        window.location.reload();
      } else {
        const error = await response.json();
        handleError("Failed to remove assignment", error.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      handleError("Failed to remove assignment", "Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search service providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unassigned"
                checked={showUnassigned}
                onChange={(e) => setShowUnassigned(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="unassigned" className="text-sm text-gray-600">
                Show only unassigned
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServiceProviders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No service providers found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Categories</TableHead>
                    <TableHead>Destinations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServiceProviders.map((serviceProvider) => (
                    <TableRow key={serviceProvider.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {serviceProvider.businessName ||
                              serviceProvider.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {serviceProvider.businessEmail ||
                              serviceProvider.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            serviceProvider.isBusinessVerified
                              ? "default"
                              : "secondary"
                          }
                        >
                          {serviceProvider.isBusinessVerified
                            ? "Verified"
                            : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {serviceProvider.assignedCategories.length === 0 ? (
                          <span className="text-gray-500 text-sm">
                            No categories assigned
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {serviceProvider.assignedCategories.map(
                              (assignment) => (
                                <div
                                  key={assignment.id}
                                  className="flex items-center space-x-1"
                                >
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {assignment.category.name}
                                  </Badge>
                                  {assignment.subcategory && (
                                    <>
                                      <span className="text-gray-400">/</span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {assignment.subcategory.name}
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {serviceProvider._count.destinations}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {serviceProvider.assignedCategories.map(
                            (assignment) => (
                              <Button
                                key={assignment.id}
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveAssignment(
                                    assignment.id,
                                    serviceProvider.id
                                  )
                                }
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
