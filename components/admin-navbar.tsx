"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useToastActions } from "@/lib/toast-actions";

interface AdminNavbarProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  userName: string;
}

export function AdminNavbar({
  title,
  backHref,
  backLabel = "Back to Dashboard",
  userName,
}: AdminNavbarProps) {
  const { handleInfo, handleError } = useToastActions();
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            {backHref && (
              <Link href={backHref}>
                <Button variant="outline" size="sm">
                  ← {backLabel}
                </Button>
              </Link>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {userName}</span>
            <Button
              variant="outline"
              onClick={async () => {
                handleInfo(
                  "Signing out...",
                  "You will be redirected to the login page."
                );
                try {
                  await signOut({ callbackUrl: "/auth/signin" });
                } catch (error) {
                  console.error("Sign out error:", error);
                  handleError("Sign out failed", "Please try again.");
                }
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
