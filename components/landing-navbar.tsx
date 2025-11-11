"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryType } from "@prisma/client";

interface Category {
  id: string;
  name: string;
  type: CategoryType;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Build navigation items dynamically from categories
  const activityCategories = categories.filter(
    (cat) => cat.type === "ACTIVITY"
  );
  const destinationCategories = categories.filter(
    (cat) => cat.type === "DESTINATION"
  );
  const buyLocalCategories = categories.filter(
    (cat) => cat.type === "BUYLOCAL"
  );

  const navigationItems = [
    { label: "HOME", href: "#home" },
    {
      label: "ADVENTURE",
      href: "/activities",
      items: activityCategories.map((cat) => ({
        label: cat.name,
        href: `/destinations?category=${cat.id}`,
      })),
    },
    {
      label: "DESTINATION",
      href: "/destinations",
      items: destinationCategories.map((cat) => ({
        label: cat.name,
        href: `/destinations?category=${cat.id}`,
      })),
    },
    {
      label: "BUY LOCAL",
      href: "/buy-local",
      items: buyLocalCategories.map((cat) => ({
        label: cat.name,
        href: `/destinations?category=${cat.id}`,
      })),
    },
    { label: "BLOGS", href: "/blogs" },
    { label: "CONTACT", href: "#contact" },
  ];

  const toggleDropdown = (itemLabel: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  const toggleMobileDropdown = (itemLabel: string) => {
    setOpenMobileDropdowns((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.items ? (
                  <div className="relative group">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center space-x-1 text-gray-700 text-bold hover:text-orange-500 font-medium transition-colors duration-200"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdowns[item.label] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdowns[item.label] && item.items && item.items.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 text-bold hover:text-orange-500 hover:bg-gray-50 transition-colors duration-200"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-700 text-bold hover:text-orange-500 font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.items ? (
                    <div>
                      <button
                        onClick={() => toggleMobileDropdown(item.label)}
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openMobileDropdowns[item.label] ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {openMobileDropdowns[item.label] && item.items && item.items.length > 0 && (
                        <div className="pl-6 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-500 font-medium"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-orange-500 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button className="w-full bg-black text-white hover:bg-gray-800 px-6 py-2">
                  REQUEST A CALL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
