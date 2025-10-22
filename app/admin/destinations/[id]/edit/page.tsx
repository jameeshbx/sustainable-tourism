import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminNavbar } from "@/components/admin-navbar";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PricingCalculator } from "@/components/pricing-calculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the destination with related data
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!destination) {
    redirect("/admin/destinations");
  }

  // Fetch all categories for the dropdown
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title={`Edit ${destination.name}`}
        backHref="/admin/destinations"
        backLabel="Back to Destinations"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Edit Destination</CardTitle>
              <CardDescription>
                Update destination information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";

                  try {
                    const {
                      name,
                      description,
                      location,
                      latitude,
                      longitude,
                      pickupLocation,
                      basePrice,
                      markupPercentage,
                      finalPrice,
                      imageUrl,
                      categoryId,
                      subcategoryId,
                      status,
                    } = Object.fromEntries(formData.entries()) as Record<
                      string,
                      string
                    >;

                    console.log("Form data received:", {
                      name,
                      description,
                      location,
                      latitude,
                      longitude,
                      pickupLocation,
                      basePrice,
                      markupPercentage,
                      finalPrice,
                      imageUrl,
                      categoryId,
                      subcategoryId,
                      status,
                    });

                    // Check if destination exists
                    const existingDestination =
                      await prisma.destination.findUnique({
                        where: { id },
                      });

                    if (!existingDestination) {
                      throw new Error("Destination not found");
                    }

                    // Verify category exists
                    const category = await prisma.category.findUnique({
                      where: { id: categoryId },
                    });

                    if (!category) {
                      throw new Error("Invalid category");
                    }

                    // Verify subcategory if provided
                    let subcategory = null;
                    if (subcategoryId && subcategoryId !== "none") {
                      subcategory = await prisma.subcategory.findUnique({
                        where: { id: subcategoryId },
                      });

                      if (
                        !subcategory ||
                        subcategory.categoryId !== categoryId
                      ) {
                        throw new Error("Invalid subcategory");
                      }
                    }

                    // Calculate final price if markup is provided
                    let calculatedFinalPrice = parseFloat(finalPrice);
                    if (markupPercentage && basePrice) {
                      const base = parseFloat(basePrice);
                      const markup = parseFloat(markupPercentage);
                      calculatedFinalPrice = base + (base * markup) / 100;
                    }

                    // Validate imageUrl if provided
                    if (imageUrl && imageUrl.trim()) {
                      try {
                        new URL(imageUrl.trim());
                      } catch {
                        throw new Error("Invalid image URL format");
                      }
                    }

                    await prisma.destination.update({
                      where: { id },
                      data: {
                        name: name || "",
                        description: description || "",
                        location: location || "",
                        latitude: parseFloat(latitude || "0"),
                        longitude: parseFloat(longitude || "0"),
                        pickupLocation:
                          pickupLocation ||
                          existingDestination.pickupLocation ||
                          "",
                        basePrice: parseFloat(basePrice || "0"),
                        markupPercentage: parseFloat(markupPercentage || "0"),
                        finalPrice: calculatedFinalPrice,
                        price: calculatedFinalPrice,
                        imageUrl: imageUrl || null,
                        categoryId,
                        subcategoryId:
                          subcategoryId && subcategoryId !== "none"
                            ? subcategoryId
                            : null,
                        status: status as "PENDING" | "APPROVED" | "REJECTED",
                        approvedById:
                          status === "APPROVED"
                            ? (
                                await auth()
                              )?.user?.id
                            : existingDestination.approvedById,
                        approvedAt:
                          status === "APPROVED"
                            ? new Date()
                            : existingDestination.approvedAt,
                        rejectionReason:
                          status === "REJECTED" ? "Updated by admin" : null,
                      },
                    });

                    redirect("/admin/destinations");
                  } catch (error) {
                    console.error("Update error:", error);
                    // Check if it's a redirect error (which is expected)
                    if (
                      error instanceof Error &&
                      error.message === "NEXT_REDIRECT"
                    ) {
                      throw error; // Re-throw redirect errors
                    }
                    throw new Error(
                      error instanceof Error
                        ? error.message
                        : "Failed to update destination"
                    );
                  }
                }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Destination Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={destination.name}
                        placeholder="Enter destination name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={destination.location}
                        placeholder="Enter location"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={destination.description}
                      placeholder="Enter destination description"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing Information</h3>
                  <PricingCalculator
                    basePrice={destination.basePrice || destination.price}
                    markupPercentage={destination.markupPercentage || 0}
                    finalPrice={destination.finalPrice || destination.price}
                  />
                </div>

                {/* Category and Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Category & Status</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="categoryId">Category</Label>
                      <Select
                        name="categoryId"
                        defaultValue={destination.categoryId}
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

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={destination.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {destination.subcategory && (
                    <div>
                      <Label htmlFor="subcategoryId">Subcategory</Label>
                      <Select
                        name="subcategoryId"
                        defaultValue={destination.subcategoryId || "none"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No subcategory</SelectItem>
                          {categories
                            .find((c) => c.id === destination.categoryId)
                            ?.subcategories.map((subcategory) => (
                              <SelectItem
                                key={subcategory.id}
                                value={subcategory.id}
                              >
                                {subcategory.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Additional Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        defaultValue={destination.latitude}
                        placeholder="0.000000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        defaultValue={destination.longitude}
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      name="pickupLocation"
                      defaultValue={destination.pickupLocation || ""}
                      placeholder="Enter pickup location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      defaultValue={destination.imageUrl || ""}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Destination Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Destination Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Created by:</span>
                      <span className="ml-2 font-medium">
                        {destination.createdBy.name ||
                          destination.createdBy.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2">
                        <Badge
                          variant={
                            destination.status === "APPROVED"
                              ? "default"
                              : destination.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {destination.status}
                        </Badge>
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium">
                        {new Date(destination.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {destination.approvedBy && (
                      <div>
                        <span className="text-gray-600">Approved by:</span>
                        <span className="ml-2 font-medium">
                          {destination.approvedBy.name ||
                            destination.approvedBy.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link href="/admin/destinations">
                    <Button type="button" variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
