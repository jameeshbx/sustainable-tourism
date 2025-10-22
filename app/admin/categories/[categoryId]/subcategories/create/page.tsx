import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

export default async function CreateSubcategoryPage({
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
  });

  if (!category) {
    redirect("/admin/categories");
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Create Subcategory"
        backHref="/admin/categories"
        backLabel="Back to Categories"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>Create New Subcategory</CardTitle>
              <CardDescription>
                Add a new subcategory under &quot;{category.name}&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  formData.append("categoryId", categoryId);

                  const response = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/categories/${categoryId}/subcategories`,
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
                    throw new Error(
                      error.error || "Failed to create subcategory"
                    );
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Subcategory Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Mountain Trekking"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of this subcategory..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Create Subcategory
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
