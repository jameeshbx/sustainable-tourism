import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminNavbar } from "@/components/admin-navbar";
import { CategoryAssignmentsClient } from "@/components/category-assignments-client";
import { Users, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ServiceProviderCategoryAssignmentsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all service providers with their category assignments
  const serviceProviders = await prisma.user.findMany({
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

  // Calculate statistics
  const totalServiceProviders = serviceProviders.length;
  const serviceProvidersWithCategories = serviceProviders.filter(
    (sp) => sp.assignedCategories.length > 0
  ).length;
  const totalAssignments = serviceProviders.reduce(
    (total, sp) => total + sp.assignedCategories.length,
    0
  );

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Service Provider Category Assignments"
        backHref="/admin/dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/admin/service-providers">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Service Providers
                </Button>
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Category Assignment Management
            </h2>
            <p className="text-gray-600 mt-2">
              Assign and manage categories for service providers
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Total Service Providers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalServiceProviders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      With Categories
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {serviceProvidersWithCategories}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Badge className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Total Assignments
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalAssignments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Providers List */}
          {serviceProviders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  No service providers found.
                </p>
                <Link href="/admin/users">
                  <Button>Manage Users</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <CategoryAssignmentsClient
              serviceProviders={serviceProviders}
              categories={categories}
            />
          )}
        </div>
      </main>
    </div>
  );
}
