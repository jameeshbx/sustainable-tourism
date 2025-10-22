import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  _count: {
    destinations: number;
  };
  subcategories: {
    id: string;
    name: string;
    _count: {
      destinations: number;
    };
  }[];
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
  activeSubcategory?: string;
  baseUrl?: string;
  showSubcategories?: boolean;
}

export function CategoryFilter({
  categories,
  activeCategory,
  activeSubcategory,
  baseUrl = "/destinations",
  showSubcategories = true,
}: CategoryFilterProps) {
  const activeCategoryData = categories.find(
    (cat) => cat.id === activeCategory
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Browse by Category
      </h2>

      {/* Categories as Badges */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Link href={baseUrl}>
            <Badge
              variant={
                !activeCategory || activeCategory === "all"
                  ? "default"
                  : "secondary"
              }
              className="px-3 py-1 text-sm cursor-pointer hover:bg-primary/80"
            >
              All Categories
            </Badge>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`${baseUrl}?category=${category.id}`}>
              <Badge
                variant={
                  activeCategory === category.id ? "default" : "secondary"
                }
                className="px-3 py-1 text-sm cursor-pointer hover:bg-primary/80"
              >
                {category.name} ({category._count.destinations})
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Subcategories for Active Category */}
      {showSubcategories &&
        activeCategory &&
        activeCategory !== "all" &&
        activeCategoryData && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Subcategories
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeCategoryData.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`${baseUrl}?category=${activeCategory}&subcategory=${subcategory.id}`}
                >
                  <Badge
                    variant={
                      activeSubcategory === subcategory.id
                        ? "default"
                        : "outline"
                    }
                    className="px-3 py-1 text-sm cursor-pointer hover:bg-primary/80"
                  >
                    {subcategory.name} ({subcategory._count.destinations})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
