"use client";

import { Carousel3D } from "./3d-carousel";

const keralaCarouselItems = [
  {
    id: "theyyam",
    image: "/theyyam-performer.jpg", // You'll need to add this image
    title: "Witness the Spirit of Theyyam",
    description: "Experience the divine art form of Kerala",
  },
  {
    id: "kathakali",
    image: "/kathakali-makeup.jpg", // You'll need to add this image
    title: "Behind the Colors of Kathakali",
    description: "Discover the intricate art of classical dance",
  },
  {
    id: "spices",
    image: "/spice-gardens.jpg", // You'll need to add this image
    title: "From Kerala's Spice Gardens",
    description: "Explore the aromatic world of Kerala spices",
  },
  {
    id: "waterfalls",
    image: "/kerala-waterfalls.jpg", // You'll need to add this image
    title: "Wander Through Wild Kerala",
    description: "Adventure through Kerala's natural wonders",
  },
];

export function KeralaCarouselSection() {
  return (
    <div className="relative">
      {/* Background with foggy effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Foggy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />

      {/* Carousel content */}
      <div className="relative z-10">
        <Carousel3D
          items={keralaCarouselItems}
          autoRotate={true}
          rotationSpeed={4000}
        />
      </div>
    </div>
  );
}
