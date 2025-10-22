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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AdminNavbar } from "@/components/admin-navbar";
import { ServiceProviderCategoryManager } from "@/components/service-provider-category-manager";

export default async function AdminServiceProvidersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all service providers
  const serviceProvidersData = await prisma.user.findMany({
    where: {
      role: "SERVICE_PROVIDER",
    },
    include: {
      assignedCategories: {
        include: {
          category: true,
          subcategory: true,
        },
      },
      _count: {
        select: {
          destinations: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transform the data to ensure name is not null and handle null businessName
  const serviceProviders = serviceProvidersData.map((sp) => ({
    ...sp,
    name: sp.name || "Unknown",
    businessName: sp.businessName || undefined,
    assignedCategories: sp.assignedCategories.map((ac) => ({
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
  }));

  // Fetch all categories for assignment
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
        title="Service Provider Management"
        backHref="/admin/dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Service Providers
              </h2>
              <div className="flex space-x-2">
                <Link href="/admin/users">
                  <Button variant="outline">Manage Users</Button>
                </Link>
                <Link href="/admin/service-providers/category-assignments">
                  <Button variant="outline">Category Assignments</Button>
                </Link>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Manage service providers and their category assignments
            </p>
          </div>

          {/* Service Providers List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Service Providers ({serviceProviders.length})
            </h3>
            {serviceProviders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No service providers found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceProviders.map((serviceProvider) => (
                  <Card key={serviceProvider.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {serviceProvider.businessName || serviceProvider.name}
                      </CardTitle>
                      <CardDescription>
                        {serviceProvider.businessEmail || serviceProvider.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
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
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Destinations:
                          </span>
                          <span className="text-sm font-medium">
                            {serviceProvider._count.destinations}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Categories:
                          </span>
                          <span className="text-sm font-medium">
                            {serviceProvider.assignedCategories.length}
                          </span>
                        </div>

                        {serviceProvider.businessType && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Type:</span>
                            <span className="text-sm font-medium">
                              {serviceProvider.businessType}
                            </span>
                          </div>
                        )}

                        {serviceProvider.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Location:
                            </span>
                            <span className="text-sm font-medium">
                              {serviceProvider.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <ServiceProviderCategoryManager
                          serviceProvider={serviceProvider}
                          categories={categories}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
