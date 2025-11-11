"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeroCard {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  navigationLink?: string;
}

interface HeroSectionProps {
  backgroundImage?: string;
  headline?: string;
  subtext?: string;
  ctaText?: string;
  ctaLink?: string;
  heroCards?: HeroCard[];
}

const ITEMS_VISIBLE = 4;
const AUTO_ROTATE_INTERVAL = 4000; // 4 seconds

export function HeroSection({
  backgroundImage = "hero-bg.png",
  headline = "TRAVEL. EXPERIENCE. EMPOWER LOCAL.",
  subtext = "Discover sustainable adventures that connect you with nature and local communities",
  ctaText = "Request More",
  ctaLink = "#contact",
  heroCards = [],
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [config, setConfig] = useState<{
    heroBackgroundImage?: string;
    heroHeadline?: string;
    heroSubtext?: string;
    heroCtaText?: string;
    heroCtaLink?: string;
    heroCards: HeroCard[];
  } | null>(null);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [preloadedImageUrl, setPreloadedImageUrl] = useState<string | null>(null);

  // Preload background image function
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        setPreloadedImageUrl(url);
        setBackgroundImageLoaded(true);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/landing-page?section=hero");
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
          
          // Preload the background image if it exists
          if (data.heroBackgroundImage) {
            try {
              await preloadImage(data.heroBackgroundImage);
            } catch (error) {
              console.error("Error preloading background image:", error);
              // If preload fails, still set it but mark as loaded to avoid infinite wait
              setPreloadedImageUrl(data.heroBackgroundImage);
              setBackgroundImageLoaded(true);
            }
          } else {
            // If no configured image, use default and mark as loaded
            setBackgroundImageLoaded(true);
          }
        } else {
          // If API fails, use default and mark as loaded
          setBackgroundImageLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching hero config:", error);
        // On error, use default and mark as loaded
        setBackgroundImageLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  // Use config data if available, otherwise use props
  // Use preloaded image if available, otherwise use configured or default
  const finalBackgroundImage = preloadedImageUrl || config?.heroBackgroundImage || backgroundImage;
  const finalHeadline = config?.heroHeadline || headline;
  const finalSubtext = config?.heroSubtext || subtext;
  const finalCtaText = config?.heroCtaText || ctaText;
  const finalCtaLink = config?.heroCtaLink || ctaLink;
  const finalHeroCards = config?.heroCards || heroCards;

  // Get visible cards - always show 4 items, sliding one at a time
  const getVisibleCards = () => {
    if (finalHeroCards.length <= ITEMS_VISIBLE) {
      return finalHeroCards;
    }

    const visible: HeroCard[] = [];
    for (let i = 0; i < ITEMS_VISIBLE; i++) {
      const index = (currentIndex + i) % finalHeroCards.length;
      visible.push(finalHeroCards[index]);
    }
    return visible;
  };

  const visibleCards = getVisibleCards();
  const canSlide = finalHeroCards.length > ITEMS_VISIBLE;

  // Auto-rotation effect - slide one item at a time
  useEffect(() => {
    if (!canSlide || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % finalHeroCards.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [canSlide, isPaused, finalHeroCards.length]);

  const handlePrev = () => {
    if (!canSlide) return;
    setCurrentIndex((prev) => (prev - 1 + finalHeroCards.length) % finalHeroCards.length);
    setIsPaused(true);
    // Resume auto-rotation after 2 seconds
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleNext = () => {
    if (!canSlide) return;
    setCurrentIndex((prev) => (prev + 1) % finalHeroCards.length);
    setIsPaused(true);
    // Resume auto-rotation after 2 seconds
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Determine which background image to show
  const showConfiguredImage = backgroundImageLoaded && preloadedImageUrl && config?.heroBackgroundImage;
  const defaultBg = backgroundImage;
  const configuredBg = config?.heroBackgroundImage || backgroundImage;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Default Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${defaultBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: showConfiguredImage ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
      
      {/* Configured Background Layer - Only shown when loaded */}
      {config?.heroBackgroundImage && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${configuredBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: showConfiguredImage ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      )}
      
      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
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
          {finalHeadline}
        </h1>
        {finalSubtext && (
          <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
            {finalSubtext}
          </p>
        )}

        <Button
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-bold"
          onClick={() => {
            const element = document.querySelector(finalCtaLink);
            element?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {finalCtaText}
        </Button>
        </div>

        {/* Carousel Section */}
        <div className="absolute bottom-0 left-0 w-full z-20 ">
        <div className="relative">
          {/* Carousel with foggy background */}
          <div className="relative py-12 bg-transparent">
            <div className="container mx-auto px-4">
              {/* Simple Cards Carousel */}
              {finalHeroCards.length > 0 && (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="flex gap-6 overflow-hidden pb-4 justify-center items-center">
                    {/* Previous Button */}
                    {canSlide && (
                      <button
                        onClick={handlePrev}
                        className="absolute left-0 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                        aria-label="Previous cards"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                    )}

                    {/* Cards Container - Always show 4 items, sliding one at a time */}
                    <div className="flex gap-6 justify-center items-center px-12">
                      {visibleCards.map((item, idx) => {
                        const cardContent = (
                          <div
                            key={`${item.id}-${currentIndex}-${idx}`}
                            className="flex-shrink-0 w-48 bg-transparent rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-105"
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
                              {item.subtitle && (
                                <p className="text-white/80 text-sm">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        );

                        return item.navigationLink ? (
                          <Link
                            key={`${item.id}-${currentIndex}-${idx}`}
                            href={item.navigationLink}
                            className="block"
                          >
                            {cardContent}
                          </Link>
                        ) : (
                          cardContent
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    {canSlide && (
                      <button
                        onClick={handleNext}
                        className="absolute right-0 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                        aria-label="Next cards"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Navigation Dots - Show dots for each item when sliding */}
                  {canSlide && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {finalHeroCards.map((_, index) => {
                        const isActive = index === currentIndex;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentIndex(index);
                              setIsPaused(true);
                              setTimeout(() => setIsPaused(false), 2000);
                            }}
                            className={`rounded-full transition-all duration-200 ${
                              isActive
                                ? "bg-white w-8 h-2"
                                : "bg-white/50 w-2 h-2"
                            }`}
                            aria-label={`Go to item ${index + 1}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
