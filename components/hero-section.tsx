"use client";

import { Button } from "@/components/ui/button";

const keralaCarouselItems = [
  {
    id: "theyyam",
    image: "/carousel-img1.png",
    title: "Witness the Spirit of Theyyam",
    description: "Experience the divine art form of Kerala",
  },
  {
    id: "kathakali",
    image: "/carousel-img2.png",
    title: "Behind the Colors of Kathakali",
    description: "Discover the intricate art of classical dance",
  },
  {
    id: "spices",
    image: "/carousel-img3.png",
    title: "From Kerala's Spice Gardens",
    description: "Explore the aromatic world of Kerala spices",
  },
  {
    id: "waterfalls",
    image: "/carousel-img4.png",
    title: "Wander Through Wild Kerala",
    description: "Adventure through Kerala's natural wonders",
  },
];

interface HeroSectionProps {
  backgroundImage?: string;
  headline?: string;
  subtext?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  backgroundImage = "hero-bg.png",
  headline = "TRAVEL. EXPERIENCE. EMPOWER LOCAL.",
  subtext = "Discover sustainable adventures that connect you with nature and local communities",
  ctaText = "Request More",
  ctaLink = "#contact",
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Bottom fade to white overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, white 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Foggy Cloud Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-80 pointer-events-none">
        {/* Cloud 1 - Left side */}
        <div
          className="absolute bottom-0 left-0 w-full h-full opacity-100"
          style={{
            backgroundImage: "url('/cloud1.png')",
            backgroundSize: "contain",
            backgroundPosition: "left bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Cloud 2 - Center */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full opacity-100"
          style={{
            backgroundImage: "url('/cloud2.png')",
            backgroundSize: "contain",
            backgroundPosition: "center bottom",
            backgroundRepeat: "repeat",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        />

        {/* Cloud 3 - Right side */}
        <div
          className="absolute bottom-0 right-0 w-full h-full opacity-100"
          style={{
            backgroundImage: "url('/cloud3.png')",
            backgroundSize: "contain",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto -mt-[300px]">
        <h1 className="text-6xl sm:text-5xl lg:text-7xl font-bold text-yellow-400 uppercase tracking-wide mb-6">
          {headline}
        </h1>

        <Button
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-bold"
          onClick={() => {
            const element = document.querySelector(ctaLink);
            element?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {ctaText}
        </Button>
      </div>

      {/* Carousel Section */}
      <div className="absolute bottom-0 left-0 w-full z-20 ">
        <div className="relative">
          {/* Carousel with foggy background */}
          <div className="relative py-12 bg-transparent">
            <div className="container mx-auto px-4">
              {/* Simple Cards Carousel */}
              <div className="relative">
                <div className="flex gap-18 overflow-x-auto pb-4 scrollbar-hide justify-center">
                  {keralaCarouselItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-48 bg-transparent rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {/* Image */}
                      <div className="relative h-64 w-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>

                      {/* Content */}
                      <div className="p-4 bg-transparent">
                        <h3 className="text-white font-bold text-lg mb-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {keralaCarouselItems.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-white/50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
