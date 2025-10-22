import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DestinationCard } from "@/components/destination-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchFilter } from "@/components/search-filter";
import { AdminNavbar } from "@/components/admin-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Await searchParams before using its properties
  const params = await searchParams;

  // Fetch categories for filtering
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

  // Build where clause for filtering
  const where: Record<string, unknown> = {};
  if (params.category && params.category !== "all") {
    where.categoryId = params.category;
  }
  if (params.subcategory) {
    where.subcategoryId = params.subcategory;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // Fetch all destinations with related data
  const allDestinations = await prisma.destination.findMany({
    where,
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
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Separate destinations by status
  const pendingDestinations = allDestinations.filter(
    (d) => d.status === "PENDING"
  );
  const approvedDestinations = allDestinations.filter(
    (d) => d.status === "APPROVED"
  );
  const rejectedDestinations = allDestinations.filter(
    (d) => d.status === "REJECTED"
  );

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Destination Management"
        backHref="/admin/dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                All Destinations
              </h2>
              <div className="flex space-x-2">
                <Link href="/admin/categories">
                  <Button variant="outline">Manage Categories</Button>
                </Link>
                <Link href="/admin/destinations/create">
                  <Button>Create New Destination</Button>
                </Link>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Manage tour destinations, categories, and subcategories
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter
                searchValue={params.search}
                categoryValue={params.category}
                subcategoryValue={params.subcategory}
                categories={categories}
                searchPlaceholder="Search destinations..."
                categoryPlaceholder="All categories"
                subcategoryPlaceholder="All subcategories"
                submitButtonText="Search"
              />
            </CardContent>
          </Card>

          {/* Categories Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={params.category}
            activeSubcategory={params.subcategory}
            baseUrl="/admin/destinations"
          />

          {/* Destinations List */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingDestinations.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedDestinations.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedDestinations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Destinations ({pendingDestinations.length})
                </h3>
                {pendingDestinations.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        No pending destinations found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingDestinations.map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={{
                          ...destination,
                          imageUrl: destination.imageUrl || undefined,
                          createdBy: {
                            ...destination.createdBy,
                            name: destination.createdBy.name || "Unknown",
                          },
                        }}
                        showCreatedBy={true}
                        editHref={`/admin/destinations/${destination.id}/edit`}
                        viewHref={`/admin/destinations/${destination.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Approved Destinations ({approvedDestinations.length})
                </h3>
                {approvedDestinations.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        No approved destinations found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedDestinations.map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={{
                          ...destination,
                          imageUrl: destination.imageUrl || undefined,
                          createdBy: {
                            ...destination.createdBy,
                            name: destination.createdBy.name || "Unknown",
                          },
                        }}
                        showCreatedBy={true}
                        editHref={`/admin/destinations/${destination.id}/edit`}
                        viewHref={`/admin/destinations/${destination.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Rejected Destinations ({rejectedDestinations.length})
                </h3>
                {rejectedDestinations.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        No rejected destinations found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rejectedDestinations.map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={{
                          ...destination,
                          imageUrl: destination.imageUrl || undefined,
                          createdBy: {
                            ...destination.createdBy,
                            name: destination.createdBy.name || "Unknown",
                          },
                        }}
                        showCreatedBy={true}
                        editHref={`/admin/destinations/${destination.id}/edit`}
                        viewHref={`/admin/destinations/${destination.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
