import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AdminNavbar } from "@/components/admin-navbar";
import { ExpandableCategory } from "@/components/expandable-category";

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories with subcategories and destination counts
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        include: {
          _count: {
            select: {
              destinations: true,
            },
          },
        },
        orderBy: {
          name: "asc",
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

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Category Management"
        backHref="/admin/dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Categories & Subcategories
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage tour categories and their subcategories
                </p>
                {categories.length > 0 && (
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>
                      {categories.length}{" "}
                      {categories.length === 1 ? "category" : "categories"}
                    </span>
                    <span>
                      {categories.reduce(
                        (total, cat) => total + cat.subcategories.length,
                        0
                      )}{" "}
                      subcategories
                    </span>
                    <span>
                      {categories.reduce(
                        (total, cat) => total + cat._count.destinations,
                        0
                      )}{" "}
                      total destinations
                    </span>
                  </div>
                )}
              </div>
              <Link href="/admin/categories/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </Link>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">No categories found.</p>
                  <Link href="/admin/categories/create">
                    <Button>Create First Category</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <ExpandableCategory key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
