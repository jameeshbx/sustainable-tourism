import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminNavbar } from "@/components/admin-navbar";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Admin Dashboard"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Review and manage user accounts, invite new users, and verify
                  service providers.
                </p>
                <div className="flex space-x-2">
                  <Link href="/admin/users">
                    <Button>Manage Users</Button>
                  </Link>
                  <Link href="/admin/service-providers">
                    <Button variant="outline">Service Providers</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destination Management</CardTitle>
                <CardDescription>
                  Manage tour destinations and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create, edit, and manage tour destinations, categories, and
                  subcategories.
                </p>
                <div className="flex space-x-2">
                  <Link href="/admin/destinations">
                    <Button>Manage Destinations</Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline">Manage Categories</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Moderate platform content and listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Review and approve content, manage reported items.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View platform analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Access user engagement and platform usage statistics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Provider Verification</CardTitle>
                <CardDescription>
                  Verify and approve service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Review business licenses and verify service provider
                  credentials.
                </p>
                <div className="flex space-x-2">
                  <Link href="/admin/service-providers">
                    <Button>Service Providers</Button>
                  </Link>
                  <Link href="/admin/service-providers/category-assignments">
                    <Button variant="outline">Category Assignments</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage user support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Handle user inquiries and support requests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Landing Page</CardTitle>
                <CardDescription>Configure landing page sections</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Manage hero section, cards, and other landing page content.
                </p>
                <Link href="/admin/landing-page">
                  <Button>Configure Landing Page</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Manage platform configurations and policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
