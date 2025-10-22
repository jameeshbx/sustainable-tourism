import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminNavbar } from "@/components/admin-navbar";

export default async function CreateCategoryPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Create Category"
        backHref="/admin/categories"
        backLabel="Back to Categories"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
              <CardDescription>
                Add a new tour category to organize destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const response = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/categories`,
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        cookie: await import("next/headers").then(
                          ({ cookies }) => cookies().toString()
                        ),
                      },
                    }
                  );

                  if (response.ok) {
                    redirect("/admin/categories");
                  } else {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to create category");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Adventure Tours"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of this category..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Create Category
                  </Button>
                  <Link href="/admin/categories">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
