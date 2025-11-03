"use client";

import { Card } from "@/components/ui/card";

interface LocalProduct {
  id: string;
  title: string;
  image: string;
  tag?: string;
  price?: string;
  rating?: number;
  category?: string;
  colors?: string[];
}

interface BuyFromLocalProps {
  title?: string;
  description?: string;
  products?: LocalProduct[];
}

export function BuyFromLocal({
  title = "Buy From Local",
  description = "Follow the most popular trends and get exclusive items from shop",
  products = [
    {
      id: "1",
      title: "Handmade Souvenirs",
      image: "/handmadesouvenirs.jpg",
      tag: "NEW",
      price: "₹300",
      rating: 4.5,
      category: "Toys",
      colors: ["#000000", "#1e3a8a", "#64748b"],
    },
    {
      id: "2",
      title: "Green Living Essentials",
      image: "/greenplants.jpg",
      tag: "POPULAR",
      price: "₹200",
      rating: 4.0,
      category: "Plants",
      colors: ["#000000", "#1e3a8a", "#60a5fa"],
    },
    {
      id: "3",
      title: "Crafts & Artisan Goods",
      image: "/crafts.jpg",
      tag: "LIMITED",
      price: "₹550",
      rating: 4.5,
      category: "Doll",
      colors: ["#000000", "#1e3a8a", "#94a3b8"],
    },
    {
      id: "4",
      title: "Ethnic Art & Artifacts",
      image: "/ethnicart.jpg",
      tag: "HANDMADE",
      price: "₹750",
      rating: 4.5,
      category: "Art",
      colors: ["#000000", "#1e3a8a", "#94a3b8"],
    },
    {
      id: "5",
      title: "Local Treasures",
      image: "/localtreasure.jpg",
      tag: "UNIQUE",
      price: "₹1000",
      rating: 4.5,
      category: "Art",
      colors: ["#000000", "#1e3a8a", "#94a3b8"],
    },
  ],
}: BuyFromLocalProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl  text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-none p-0 border-0 rounded-none"
            >
              <div className="relative">
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
                {product.tag && (
                  <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                    {product.tag}
                  </div>
                )}
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-2 pr-2">
                    {product.colors?.map((color) => (
                      <span
                        key={color}
                        className="inline-block h-2 w-2 rounded-sm border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-gray-900">{product.title}</h3>
                {product.price && (
                  <p className="mt-2 text-gray-900">{product.price}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
