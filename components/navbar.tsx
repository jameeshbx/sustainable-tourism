"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  variant?: "default" | "simple";
  showDestinationsLink?: boolean;
}

export function Navbar({
  variant = "default",
  showDestinationsLink = true,
}: NavbarProps) {
  const { data: session } = useSession();

  if (variant === "simple") {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl font-semibold text-gray-900">
                  🌱 Sustainable Tourism
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="text-green-700 border-green-300 hover:bg-green-50"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-green-700">
                🌱 Sustainable Tourism
              </h1>
            </Link>
            {showDestinationsLink && (
              <Link href="/destinations">
                <Button
                  variant="ghost"
                  className="text-green-700 hover:bg-green-50"
                >
                  Destinations
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {session.user?.role}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="text-green-700 border-green-300 hover:bg-green-50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-300 hover:bg-green-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
