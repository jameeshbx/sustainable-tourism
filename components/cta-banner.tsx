"use client";

import { Button } from "@/components/ui/button";
import { Mountain, Sun } from "lucide-react";

interface CTABannerProps {
  text?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  className?: string; // additional classes for outer wrapper
  unstyled?: boolean; // when true, render only the banner block (no section spacing)
}

export function CTABanner({
  text = "Ready to adventure and enjoy natural",
  ctaText = "Sign up now",
  ctaLink = "#contact",
  backgroundColor = "bg-[#63AB45]",
  className = "",
  unstyled = false,
}: CTABannerProps) {
  return (
    <>
      {!unstyled ? (
        <section className={`py-2 bg-white ${className}`}>
          <div
            className={`max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8 rounded-md ${backgroundColor}`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between">
              {/* Left side - Icon and Text */}
              <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <Mountain className="h-8 w-8 text-white" />
                  <Sun className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {text}
                </h2>
              </div>

              {/* Right side - CTA Button */}
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={() => {
                  const element = document.querySelector(ctaLink);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div
          className={`max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 rounded-md ${backgroundColor} ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 sm:mb-0">
              <div className="flex items-center space-x-2">
                <Mountain className="h-8 w-8 text-white" />
                <Sun className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {text}
              </h2>
            </div>
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              onClick={() => {
                const element = document.querySelector(ctaLink);
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
