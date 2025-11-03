"use client";

import { Users, Leaf, Handshake } from "lucide-react";
import { CTABanner } from "@/components/cta-banner";

interface Feature {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
}

interface WhyTrekkingMilesProps {
  title?: string;
  description?: string;
  image?: string;
  features?: Feature[];
}

export function WhyTrekkingMiles({
  title = "Why Trekking Miles?",
  description = "We are committed to creating meaningful travel experiences that benefit both travelers and local communities while preserving the natural environment for future generations.",
  image = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  features = [
    {
      id: "1",
      title: "Community-based travel",
      icon: <Users className="h-8 w-8" />,
      description:
        "Direct support to local communities through authentic experiences",
    },
    {
      id: "2",
      title: "Eco-conscious experiences",
      icon: <Leaf className="h-8 w-8" />,
      description: "Minimal environmental impact with maximum positive impact",
    },
    {
      id: "3",
      title: "Fair & transparent pricing",
      icon: <Handshake className="h-8 w-8" />,
      description:
        "Honest pricing that ensures fair compensation for all stakeholders",
    },
  ],
}: WhyTrekkingMilesProps) {
  return (
    <section className="bg-white relative pt-32 mb-16">
      {/* Floating CTA banner overlapping the top */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 translate-y-[25%] w-full">
        <div className="pointer-events-auto px-4  sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <CTABanner unstyled className="mx-auto py-16" />
        </div>
      </div>
      <div className="w-full mx-0 px-0 rounded-none">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <img
              src={image}
              alt="Why Trekking Miles"
              className="w-full h-136 object-cover"
            />
          </div>

          {/* Right side - Content */}
          <div className="mt-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {description}
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-4">
                  <div className="text-green-600 mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-gray-600">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
