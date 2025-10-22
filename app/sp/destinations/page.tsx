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
import { Badge } from "@/components/ui/badge";
import { DestinationCard } from "@/components/destination-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ServiceProviderDestinationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SERVICE_PROVIDER") {
    redirect("/");
  }

  // Fetch destinations created by this service provider
  const allDestinations = await prisma.destination.findMany({
    where: {
      createdById: session.user.id,
    },
    include: {
      category: true,
      subcategory: true,
      approvedBy: {
        select: {
          id: true,
          name: true,
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

  // Fetch assigned categories for this service provider
  const assignedCategories = await prisma.serviceProviderCategory.findMany({
    where: {
      serviceProviderId: session.user.id,
    },
    include: {
      category: true,
      subcategory: true,
    },
  });

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/sp/dashboard">
                <Button variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                My Destinations
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                My Destinations
              </h2>
              <Link href="/sp/destinations/create">
                <Button>Create New Destination</Button>
              </Link>
            </div>
            <p className="text-gray-600 mt-2">
              Manage your tour destinations and offerings
            </p>
          </div>

          {/* Assigned Categories */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Assigned Categories</CardTitle>
              <CardDescription>
                You can only create destinations in these categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedCategories.length === 0 ? (
                <p className="text-gray-500">
                  No categories assigned yet. Contact an administrator to get
                  category assignments.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedCategories.map((assignment) => (
                    <Badge
                      key={assignment.id}
                      variant="secondary"
                      className="text-sm"
                    >
                      {assignment.category.name}
                      {assignment.subcategory && (
                        <span className="ml-1">
                          / {assignment.subcategory.name}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destinations List */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({allDestinations.length})
              </TabsTrigger>
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

            <TabsContent value="all">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Destinations ({allDestinations.length})
                </h3>
                {allDestinations.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">
                        You haven&apos;t created any destinations yet.
                      </p>
                      <Link href="/sp/destinations/create">
                        <Button className="mt-4">
                          Create Your First Destination
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allDestinations.map((destination) => (
                      <div key={destination.id} className="relative">
                        <DestinationCard
                          destination={destination}
                          editHref={`/sp/destinations/${destination.id}/edit`}
                          viewHref={`/sp/destinations/${destination.id}`}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              destination.status === "APPROVED"
                                ? "default"
                                : destination.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {destination.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Destinations ({pendingDestinations.length})
                </h3>
                {pendingDestinations.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No pending destinations.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingDestinations.map((destination) => (
                      <div key={destination.id} className="relative">
                        <DestinationCard
                          destination={destination}
                          editHref={`/sp/destinations/${destination.id}/edit`}
                          viewHref={`/sp/destinations/${destination.id}`}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">PENDING</Badge>
                        </div>
                      </div>
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
                      <p className="text-gray-500">No approved destinations.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedDestinations.map((destination) => (
                      <div key={destination.id} className="relative">
                        <DestinationCard
                          destination={destination}
                          editHref={`/sp/destinations/${destination.id}/edit`}
                          viewHref={`/sp/destinations/${destination.id}`}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="default">APPROVED</Badge>
                        </div>
                      </div>
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
                      <p className="text-gray-500">No rejected destinations.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rejectedDestinations.map((destination) => (
                      <div key={destination.id} className="relative">
                        <DestinationCard
                          destination={destination}
                          editHref={`/sp/destinations/${destination.id}/edit`}
                          viewHref={`/sp/destinations/${destination.id}`}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive">REJECTED</Badge>
                        </div>
                        {destination.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <strong>Reason:</strong>{" "}
                            {destination.rejectionReason}
                          </div>
                        )}
                      </div>
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
