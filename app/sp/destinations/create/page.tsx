import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DynamicDestinationForm } from "@/components/dynamic-destination-form";

export default async function CreateDestinationPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SERVICE_PROVIDER") {
    redirect("/");
  }

  // Fetch assigned categories for this service provider
  const assignedCategories = await prisma.serviceProviderCategory.findMany({
    where: {
      serviceProviderId: session.user.id,
    },
    include: {
      category: {
        include: {
          subcategories: {
            orderBy: {
              name: "asc",
            },
          },
          formFields: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      subcategory: true,
    },
  });

  // Group assignments by category to avoid duplicates
  const categoryMap = new Map();

  assignedCategories.forEach((assignment) => {
    const categoryId = assignment.category.id;

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        ...assignment.category,
        subcategories: assignment.category.subcategories, // Use the actual subcategories from the assignment
        assignedSubcategoryIds: new Set(),
      });
    }

    const categoryData = categoryMap.get(categoryId);

    // Add subcategory if it's specifically assigned
    if (assignment.subcategoryId) {
      categoryData.assignedSubcategoryIds.add(assignment.subcategoryId);
    }
  });

  // Filter subcategories based on assignments
  const categories = Array.from(categoryMap.values()).map((category) => {
    const filteredSubcategories = category.subcategories.filter(
      (sub: { id: string }) => {
        // Include subcategory if it's specifically assigned or if no specific subcategory is assigned for this category
        return (
          category.assignedSubcategoryIds.size === 0 ||
          category.assignedSubcategoryIds.has(sub.id)
        );
      }
    );

    return {
      ...category,
      subcategories: filteredSubcategories,
    };
  });

  // Check if service provider has any assigned categories
  if (categories.length === 0) {
    return (
      <div className="min-h-screen">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/sp/destinations">
                  <Button variant="outline" size="sm">
                    ← Back to Destinations
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  Create Destination
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>No Categories Assigned</CardTitle>
                <CardDescription>
                  You don&apos;t have any categories assigned yet. Contact an
                  administrator to get category assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/sp/destinations">
                  <Button>Back to Destinations</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/sp/destinations">
                <Button variant="outline" size="sm">
                  ← Back to Destinations
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Create Destination
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Create New Destination</CardTitle>
              <CardDescription>
                Add a new tour destination with all required information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicDestinationForm
                categories={categories}
                onSubmit={async (formData: FormData) => {
                  "use server";
                  const response = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/destinations`,
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        cookie: await import("next/headers").then(
                          async ({ cookies }) => (await cookies()).toString()
                        ),
                      },
                    }
                  );

                  if (response.ok) {
                    redirect("/sp/destinations");
                  } else {
                    const error = await response.json();
                    throw new Error(
                      error.error || "Failed to create destination"
                    );
                  }
                }}
                submitText="Create Destination"
                cancelHref="/sp/destinations"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
