import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DynamicDestinationForm } from "@/components/dynamic-destination-form";
import { AdminNavbar } from "@/components/admin-navbar";

export default async function CreateDestinationPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories with subcategories and form fields
  const categoriesData = await prisma.category.findMany({
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
    orderBy: {
      name: "asc",
    },
  });

  // Transform the data to match the expected Category interface
  const categories = categoriesData.map((category) => ({
    ...category,
    formFields: category.formFields.map((field) => ({
      ...field,
      placeholder: field.placeholder || undefined,
      options: field.options || undefined,
      width: field.width as "half" | "full" | undefined,
    })),
  }));

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title="Create Destination"
        backHref="/admin/destinations"
        backLabel="Back to Destinations"
        userName={session.user.name || "Admin"}
      />

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
                    redirect("/admin/destinations");
                  } else {
                    const error = await response.json();
                    throw new Error(
                      error.error || "Failed to create destination"
                    );
                  }
                }}
                submitText="Create Destination"
                cancelHref="/admin/destinations"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
