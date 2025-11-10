import { auth } from "@/lib/auth";
import Image from "next/image";
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
import { CommentSection } from "@/components/comment-section";
import { MapComponent } from "@/components/map-component";
import { RouteMapComponent } from "@/components/route-map-component";
import { ViewTracker } from "@/components/view-tracker";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          formFields: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      subcategory: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // Check if current user has liked this destination
  // This logic can be implemented in the UI component if needed

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Destination Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The destination you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user can edit this destination (only for logged in users)
  const canEdit =
    session?.user && // User must be logged in
    (session.user.role === "ADMIN" || // Admin can edit any destination
      (session.user.role === "SERVICE_PROVIDER" &&
        destination.createdById === session.user.id)); // Service provider can only edit their own destinations

  // Check if user can comment (logged in users who are not the creator)
  const canComment =
    session?.user && destination.createdById !== session.user.id;

  return (
    <div className="min-h-screen">
      <ViewTracker destinationId={id} />
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/destinations">
                <Button variant="outline" size="sm">
                  ← Back to Destinations
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Destination Details
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user ? (
                <>
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
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Destination Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        {destination.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <Badge variant="secondary" className="mr-2">
                          {destination.category.name}
                        </Badge>
                        {destination.subcategory && (
                          <Badge variant="outline">
                            {destination.subcategory.name}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${destination.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {destination.rating.toFixed(1)} ⭐ (
                        {destination.comments.length} reviews)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {destination.imageUrl && (
                  <div className="px-6 pb-4">
                    <Image
                      src={destination.imageUrl}
                      alt={destination.name}
                      width={800}
                      height={256}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700">{destination.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Location</h4>
                        <p className="text-gray-600">{destination.location}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Pickup Location
                        </h4>
                        <p className="text-gray-600">
                          {destination.pickupLocation}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Coordinates
                        </h4>
                        <p className="text-gray-600">
                          {destination.latitude}, {destination.longitude}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Created by
                        </h4>
                        <p className="text-gray-600">
                          {destination.createdBy.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <CommentSection
                destinationId={destination.id}
                comments={destination.comments}
                canComment={canComment || false}
                isLoggedIn={!!session?.user}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {canEdit && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link
                      href={
                        session?.user?.role === "ADMIN"
                          ? `/admin/destinations/${destination.id}/edit`
                          : session?.user?.role === "SERVICE_PROVIDER"
                          ? `/sp/destinations/${destination.id}/edit`
                          : `/destinations/${destination.id}/edit`
                      }
                      className="block"
                    >
                      <Button className="w-full">Edit Destination</Button>
                    </Link>
                    <Link
                      href={`/destinations/${destination.id}/delete`}
                      className="block"
                    >
                      <Button variant="destructive" className="w-full">
                        Delete Destination
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Destination Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span>{destination.category.name}</span>
                  </div>
                  {destination.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subcategory:</span>
                      <span>{destination.subcategory.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">${destination.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rating:</span>
                    <span className="font-medium">
                      {destination.rating.toFixed(1)} ⭐
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Comments:</span>
                    <span>{destination.comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span>
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Map Section */}
              {(() => {
                // Check for route fields in customFields
                const customFields = destination.customFields as
                  | Record<string, unknown>
                  | null;
                const routeFields = destination.category.formFields.filter(
                  (f) => f.type === "route"
                );

                // Find route data in customFields
                let routeData: {
                  points: Array<{
                    id: string;
                    label: string;
                    address: string;
                    coordinates: [number, number];
                  }>;
                  showRoute: boolean;
                } | null = null;

                for (const routeField of routeFields) {
                  if (customFields && customFields[routeField.name]) {
                    try {
                      const points = JSON.parse(
                        customFields[routeField.name] as string
                      );
                      if (Array.isArray(points) && points.length > 0) {
                        const routeOptions = routeField.options
                          ? JSON.parse(routeField.options)
                          : {};
                        routeData = {
                          points,
                          showRoute: routeOptions.showRoute || false,
                        };
                        break; // Use first route field found
                      }
                    } catch {
                      // Invalid JSON, skip
                    }
                  }
                }

                // If we have route data, show RouteMapComponent, otherwise show regular map
                if (routeData && routeData.points.length > 0) {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Route Map</CardTitle>
                        <CardDescription>
                          {routeData.points.length === 1
                            ? "Location"
                            : `Route with ${routeData.points.length} points`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                          <RouteMapComponent
                            points={routeData.points}
                            showRoute={routeData.showRoute}
                            zoom={14}
                            height="400px"
                            markerColor="#ef4444"
                          />
                        </div>
                        {/* Route Points List */}
                        {routeData.points.length > 1 && (
                          <div className="p-4 space-y-2 border-t">
                            <h4 className="text-sm font-medium text-gray-900">
                              Route Points
                            </h4>
                            <div className="space-y-1">
                              {routeData.points.map((point, idx) => (
                                <div
                                  key={point.id || idx}
                                  className="flex items-start space-x-2 text-sm"
                                >
                                  <span className="text-blue-600 mt-0.5">
                                    {idx + 1}.
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {point.label}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                      {point.address}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                // Default single point map
                return (
                  <div className="px-0 pb-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <MapComponent
                        latitude={destination.latitude}
                        longitude={destination.longitude}
                        zoom={14}
                        height="300px"
                        markerColor="#ef4444"
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
