"use client";

import { Card } from "@/components/ui/card";
import { Tent, Car, Flame } from "lucide-react";
import Image from "next/image";

interface EcoTrip {
  id: string;
  title: string;
  icon: string;
  description?: string;
}

interface EcoTripsSectionProps {
  smallTitle?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  ecoTrips?: EcoTrip[];
}

export function EcoTripsSection({
  smallTitle = "Travel meaningfully, not just Miles",
  title = "Curated eco-trips for \n conscious travelers",
  description = "Join our carefully crafted eco-trips that minimize environmental impact while maximizing authentic experiences with local communities.",
  backgroundImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ecoTrips = [
    {
      id: "1",
      title: "Tent Camping",
      icon: "/tent-camping-icon.png",
      description: "Sleep under the stars in eco-friendly tents",
    },
    {
      id: "2",
      title: "Tent Camping",
      icon: "/tent-camping-icon.png",
      description: "Experience nature with minimal footprint",
    },
    {
      id: "3",
      title: "Tent Camping",
      icon: "/van-camping-icon.png",
      description: "Sustainable camper van adventures",
    },
    {
      id: "4",
      title: "Adventure and climbing",
      icon: "/adventure-icon.png",
      description: "Thrilling adventures with responsible practices",
    },
  ],
}: EcoTripsSectionProps) {
  return (
    <section
      className="py-20 relative "
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
        <div className="text-center mb-16">
          <p className="text-[#F7921E] font-pecita tracking-wide text-[28px] leading-none mb-2">
            {smallTitle}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {title.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < title.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-white/90 max-w-3xl mx-auto text-lg">
            {description}
          </p>
        </div>

        {/* Eco-trip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  mb-80">
          {ecoTrips.map((trip) => (
            <Card
              key={trip.id}
              className="bg-gray-900/80 border-gray-700 hover:bg-gray-800/80 transition-colors"
            >
              <div className="p-6 text-center">
                <div className="text-white mb-4 flex justify-center">
                  <Image
                    src={trip.icon}
                    alt={trip.title}
                    width={100}
                    height={100}
                  />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {trip.title}
                </h3>
                {trip.description && (
                  <p className="text-white/80 text-sm">{trip.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
