import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  Heart,
  Eye,
  MessageSquare,
  Activity,
  Globe,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin-navbar";
import Link from "next/link";
import { UserActivityTabs } from "@/components/user-activity-tabs";
import { UserDetailsActions } from "@/components/user-details-actions";

export default async function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch user details with all related data
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          destinations: true,
          comments: true,
          likes: true,
          views: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen">
        <AdminNavbar
          title="User Not Found"
          backHref="/admin/users"
          userName={session.user.name || "Admin"}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  User Not Found
                </h3>
                <p className="text-gray-500 mb-4">
                  The user you&apos;re looking for doesn&apos;t exist or has
                  been deleted.
                </p>
                <Link href="/admin/users">
                  <Button>Back to Users</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Get user's liked destinations
  const likedDestinations = await prisma.destination.findMany({
    where: {
      likes: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      category: true,
      subcategory: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get user's viewed destinations
  const viewedDestinations = await prisma.destination.findMany({
    where: {
      views: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      category: true,
      subcategory: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get user's comments
  const userComments = await prisma.comment.findMany({
    where: {
      userId: user.id,
    },
    include: {
      destination: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get user's created destinations
  const userDestinations = await prisma.destination.findMany({
    where: {
      createdById: user.id,
    },
    include: {
      category: true,
      subcategory: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "SERVICE_PROVIDER":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Service Provider
          </Badge>
        );
      case "USER":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <User className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="User Details"
        backHref="/admin/users"
        backLabel="Back to Users"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>User Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name || "No name"}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-2">{getRoleBadge(user.role)}</div>
                  </div>
                </div>

                {/* Edit User Button */}
                <UserDetailsActions user={user} />

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4" />
                    <span>
                      Last active: {user.createdAt ? "Recently" : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {user._count.destinations}
                    </p>
                    <p className="text-sm text-gray-600">Destinations</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {user._count.likes}
                    </p>
                    <p className="text-sm text-gray-600">Likes Given</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {user._count.views}
                    </p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {user._count.comments}
                    </p>
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Tabs */}
          <UserActivityTabs
            user={user}
            likedDestinations={likedDestinations}
            viewedDestinations={viewedDestinations}
            userComments={userComments}
            userDestinations={userDestinations}
          />
        </div>
      </main>
    </div>
  );
}
