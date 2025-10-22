import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DestinationCard } from "@/components/destination-card";
import { SearchFilter } from "@/components/search-filter";
import { Navbar } from "@/components/navbar";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
  }>;
}) {
  // Await searchParams before using its properties
  const params = await searchParams;

  // Get current user session
  const session = await auth();

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
  if (params.subcategory && params.subcategory !== "all") {
    where.subcategoryId = params.subcategory;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // Fetch destinations
  const destinations = await prisma.destination.findMany({
    where,
    include: {
      category: true,
      subcategory: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      // Include user's like status if logged in
      ...(session?.user && {
        likes: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Limit to 20 destinations for performance
  });

  // Get view counts for all destinations
  const destinationIds = destinations.map((d) => d.id);
  const viewCounts = await prisma.view.groupBy({
    by: ["destinationId"],
    where: {
      destinationId: { in: destinationIds },
    },
    _count: {
      id: true,
    },
  });

  // Get user's viewed destinations if logged in
  let userViewedDestinations: string[] = [];
  if (session?.user) {
    const userViews = await prisma.view.findMany({
      where: {
        userId: session.user.id,
        destinationId: { in: destinationIds },
      },
      select: {
        destinationId: true,
      },
    });
    userViewedDestinations = userViews.map((v) => v.destinationId);
  }

  // Add isLiked and viewCount properties to each destination
  const destinationsWithLikeStatus = destinations.map((destination) => {
    const viewCount =
      viewCounts.find((vc) => vc.destinationId === destination.id)?._count.id ||
      0;
    const isViewed = session?.user
      ? userViewedDestinations.includes(destination.id)
      : false;

    return {
      ...destination,
      isLiked: session?.user
        ? destination.likes && destination.likes.length > 0
        : false,
      viewCount,
      isViewed,
    };
  });

  return (
    <div className="min-h-screen">
      <Navbar showDestinationsLink={false} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and Filter */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle>Discover Sustainable Destinations</CardTitle>
              <p className="text-gray-600 text-sm">
                Explore eco-friendly tours, adventures, and experiences that
                support local communities and preserve our planet.
              </p>
            </CardHeader>
            <CardContent>
              <SearchFilter
                searchValue={params.search}
                categoryValue={params.category}
                subcategoryValue={params.subcategory}
                categories={categories}
              />
            </CardContent>
          </Card>

          {/* Destinations List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Destinations ({destinationsWithLikeStatus.length})
            </h2>
            {destinationsWithLikeStatus.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    No destinations found matching your criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {destinationsWithLikeStatus.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    viewHref={`/destinations/${destination.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
