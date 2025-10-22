import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserPlus } from "lucide-react";
import { AdminNavbar } from "@/components/admin-navbar";
import { UserManagementTable } from "@/components/user-management-table";
import { InviteUserDialog } from "@/components/invite-user-dialog";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all users with their details
  const users = await prisma.user.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user statistics
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === "ADMIN").length;
  const serviceProviders = users.filter(
    (user) => user.role === "SERVICE_PROVIDER"
  ).length;
  const regularUsers = users.filter((user) => user.role === "USER").length;

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="User Management"
        backHref="/admin/dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage users, roles, and permissions
                </p>
                {totalUsers > 0 && (
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>
                      {totalUsers} {totalUsers === 1 ? "user" : "users"}
                    </span>
                    <span>{adminUsers} admins</span>
                    <span>{serviceProviders} service providers</span>
                    <span>{regularUsers} regular users</span>
                  </div>
                )}
              </div>
              <InviteUserDialog />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <UserPlus className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Service Providers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {serviceProviders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Regular Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {regularUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No users found.</p>
                  <InviteUserDialog />
                </div>
              ) : (
                <UserManagementTable
                  users={users}
                  currentUserId={session.user.id}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
