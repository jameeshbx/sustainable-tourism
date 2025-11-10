"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description?: string;
}

interface Carousel3DProps {
  items: CarouselItem[];
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function Carousel3D({
  items,
  autoRotate = true,
  rotationSpeed = 5000,
}: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoRotate || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, rotationSpeed);

    return () => clearInterval(interval);
  }, [autoRotate, rotationSpeed, items.length, isHovered]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const getCardStyle = (index: number) => {
    const totalItems = items.length;
    const angle = (360 / totalItems) * index;
    const radius = 200; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const z = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${-angle}deg)`,
      opacity: index === currentIndex ? 1 : 0.7,
      zIndex: index === currentIndex ? 10 : 1,
    };
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Kerala&apos;s Treasures
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in the rich culture, traditions, and natural beauty
            of God&apos;s Own Country
          </p>
        </div>

        <div
          className="relative h-96 flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 3D Carousel Container */}
          <div
            className="relative w-full h-full perspective-1000"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="absolute w-80 h-64 transition-all duration-700 ease-in-out"
                style={getCardStyle(index)}
              >
                <div className="relative w-full h-full bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-bold text-lg mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-white/90 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="lg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20"
            onClick={handlePrevious}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20"
            onClick={handleNext}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? "bg-gray-900" : "bg-gray-300"
                }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
