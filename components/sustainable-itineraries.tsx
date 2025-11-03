"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Users,
  Mountain,
  DollarSign,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface ItineraryItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface SustainableItinerariesProps {
  videoImage?: string;
  youtubeVideoId?: string;
  title?: string;
  items?: ItineraryItem[];
}

export function SustainableItineraries({
  videoImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  youtubeVideoId = "dQw4w9WgXcQ", // Default YouTube video ID
  title = "Sustainable Itineraries",
  items = [
    {
      id: "1",
      title: "Community-Based Travel Experiences",
      icon: <Users className="h-5 w-5" />,
      description:
        "Every trip supports families and preserves traditions. From spice villages to tribal settlements, your journey becomes a source of shared growth and positive impact.",
    },
    {
      id: "2",
      title: "Nature First: Responsible Adventure",
      icon: <Mountain className="h-5 w-5" />,
      description:
        "Explore pristine natural environments while following Leave No Trace principles and supporting conservation efforts.",
    },
    {
      id: "3",
      title: "Fair Pricing & Transparent Impact",
      icon: <DollarSign className="h-5 w-5" />,
      description:
        "Enjoy transparent pricing with fair compensation for local guides, accommodations, and services that support sustainable development.",
    },
  ],
}: SustainableItinerariesProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleItem = (itemId: string) => {
    setExpandedItem((prev) => (prev === itemId ? null : itemId));
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <section className="py-16 -mt-80 bg-gray-50 z-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden shadow-lg py-0">
          <div className="grid lg:grid-cols-2">
            {/* Left side - Video */}
            <div className="relative min-h-[500px] lg:min-h-full">
              {!isVideoPlaying ? (
                <div className="relative h-full">
                  <img
                    src={videoImage}
                    alt="Sustainable travel video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button
                      onClick={handleVideoPlay}
                      size="lg"
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg"
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                    title="Sustainable Travel Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
            </div>

            {/* Right side - Content */}
            <div className="bg-gray-100 pt-8 px-8 lg:pt-12 lg:px-12 z-20">
              {/* Availability Tag */}
              <div className="mb-6">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  Availability
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
                {title}
              </h2>

              {/* Accordion Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white shadow-sm border-0 mb-2"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-orange-500">{item.icon}</div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                        </div>
                        {expandedItem === item.id ? (
                          <ChevronDown className="h-5 w-5 text-orange-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedItem === item.id && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-center items-center mt-16">
        <Button
          variant="secondary"
          className="bg-black text-white text-lg py-5 px-8 md:py-6 md:px-10 hover:bg-black/80"
        >
          Explore Sustainable Tourism
        </Button>
      </div>
    </section>
  );
}
