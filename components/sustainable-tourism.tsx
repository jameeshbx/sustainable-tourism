"use client";

import { Button } from "@/components/ui/button";

interface SustainableTourismProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function SustainableTourism({
  title = "What is Sustainable Tourism?",
  description = "At Trekking Miles, we don’t just talk about sustainability—we build it into every journey. Through our eco-tours and strong local partnerships, we actively power the circular economy. Every dollar travelers spend empowers the local producers, artisans, and guides, ensuring the value stays right where it belongs. This model helps us regenerate ecosystems and secure thriving livelihoods in every community we visit.",
  backgroundImage = "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ctaText = "Contact us",
  ctaLink = "#contact",
}: SustainableTourismProps) {
  return (
    <section
      className="py-24 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="text-white/70 text-sm sm:text-base mb-3">
              Let us organize your custom-made trip!
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {title}
            </h2>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-6 text-base sm:text-lg font-semibold"
                onClick={() => {
                  const element = document.querySelector(ctaLink);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {ctaText}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
