import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FormConfigLayout } from "@/components/form-config-layout";
import { AdminNavbar } from "@/components/admin-navbar";

export default async function CategoryFormConfigPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await auth();
  const { categoryId } = await params;

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch the category with its form fields
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      formFields: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!category) {
    redirect("/admin/categories");
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar
        title={`Configure Form for ${category.name}`}
        backHref="/admin/categories"
        backLabel="Back to Categories"
        userName={session.user.name || "Admin"}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <FormConfigLayout
            categoryId={categoryId}
            categoryName={category.name}
            initialFields={category.formFields.map((field) => ({
              id: field.id,
              name: field.name,
              label: field.label,
              type: field.type,
              required: field.required,
              placeholder: field.placeholder || undefined,
              options: field.options || undefined,
              order: field.order,
              width: (field.width as "half" | "full") || "full",
            }))}
            onSave={async (fields) => {
              "use server";

              // Delete existing fields
              await prisma.formField.deleteMany({
                where: { categoryId },
              });

              // Create new fields
              await prisma.formField.createMany({
                data: fields.map((field) => ({
                  name: field.name,
                  label: field.label,
                  type: field.type,
                  required: field.required,
                  placeholder: field.placeholder,
                  options: field.options,
                  order: field.order,
                  width: field.width || "full",
                  categoryId,
                })),
              });
            }}
          />
        </div>
      </main>
    </div>
  );
}
