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

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await auth();
  const { categoryId } = await params;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the category
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      subcategories: {
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
  });

  if (!category) {
    redirect("/admin/categories");
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title={`Edit ${category.name}`}
        backHref="/admin/categories"
        backLabel="Back to Categories"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Edit Category</CardTitle>
              <CardDescription>
                Update category information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const { cookies } = await import("next/headers");
                  const cookieStore = await cookies();
                  const response = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/categories/${categoryId}`,
                    {
                      method: "PUT",
                      body: formData,
                      headers: {
                        cookie: cookieStore.toString(),
                      },
                    }
                  );

                  if (response.ok) {
                    redirect("/admin/categories");
                  } else {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to update category");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={category.name}
                    placeholder="e.g., Adventure Tours"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Category Type *</Label>
                  <select
                    id="type"
                    name="type"
                    required
                    defaultValue={category.type}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="DESTINATION">Destination</option>
                    <option value="ACTIVITY">Activity</option>
                    <option value="BUYLOCAL">Buy Local</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={category.description || ""}
                    placeholder="Brief description of this category..."
                    rows={3}
                  />
                </div>

                {/* Category Stats */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Category Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Destinations:</span>
                      <span className="ml-2 font-medium">
                        {category._count.destinations}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subcategories:</span>
                      <span className="ml-2 font-medium">
                        {category.subcategories.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link href="/admin/categories">
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
