"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { useToastActions } from "@/lib/toast-actions";
import { LikesPopup } from "@/components/likes-popup";
import { ViewsPopup } from "@/components/views-popup";
import { Portal } from "@/components/portal";

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  basePrice?: number | null;
  markupPercentage?: number | null;
  finalPrice?: number | null;
  rating: number;
  imageUrl?: string | null;
  createdAt: Date;
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  } | null;
  createdBy?: {
    name: string | null;
  };
  _count?: {
    comments: number;
    likes: number;
  };
  viewCount?: number;
  isLiked?: boolean;
  isViewed?: boolean;
  // Additional fields for the new design
  startDate?: string;
  duration?: string;
  distance?: string;
  pickupLocation?: string;
}

interface DestinationCardProps {
  destination: Destination;
  showCreatedBy?: boolean;
  editHref?: string;
  viewHref?: string;
}

export function DestinationCard({
  destination,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showCreatedBy: _showCreatedBy = false,
  editHref,
  viewHref,
}: DestinationCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { handleSuccess, handleError } = useToastActions();

  const [isLiked, setIsLiked] = useState(destination.isLiked || false);
  const [likeCount, setLikeCount] = useState(destination._count?.likes || 0);
  const [viewCount] = useState(destination.viewCount || 0);
  const [showLikesPopup, setShowLikesPopup] = useState(false);
  const [showViewsPopup, setShowViewsPopup] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleWhatsAppContact = () => {
    const whatsappNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

    const finalPrice = destination.finalPrice || destination.price;
    const message = `Hi! I'm interested in booking "${
      destination.name
    }" for ₹${finalPrice.toLocaleString()}.

Destination Details:
📍 Location: ${destination.location}
🏷️ Category: ${destination.category.name}${
      destination.subcategory ? ` - ${destination.subcategory.name}` : ""
    }
💰 Price: ₹${finalPrice.toLocaleString()}
${destination.startDate ? `📅 Start Date: ${destination.startDate}` : ""}
${destination.duration ? `⏱️ Duration: ${destination.duration}` : ""}
${destination.pickupLocation ? `🚌 Pickup: ${destination.pickupLocation}` : ""}
${destination.imageUrl ? `🖼️ Image: ${destination.imageUrl}` : ""}

Please provide more information about availability and booking process.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/destinations/${destination.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleError(
            "Please log in",
            "You need to be logged in to like destinations"
          );
          return;
        }

        throw new Error("Failed to update like");
      }

      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);

      if (data.liked) {
        handleSuccess("Liked!", "You liked this destination");
      } else {
        handleSuccess("Unliked", "You removed your like");
      }
    } catch (error) {
      console.error("Error updating like:", error);
      handleError("Failed to update like", "Please try again later.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={
        !showLikesPopup && !showViewsPopup ? { y: -8, scale: 1.02 } : {}
      }
      className="h-full"
    >
      <Card
        className={`overflow-hidden rounded-xl shadow-lg transition-all duration-300 h-full flex flex-col py-0 ${
          !showLikesPopup && !showViewsPopup ? "hover:shadow-2xl" : ""
        }`}
      >
        {/* Image Section - Cover Image */}
        <Link href={`/destinations/${destination.id}`} className="block">
          <div className="relative h-64 w-full overflow-hidden cursor-pointer group bg-gray-200">
            {destination.imageUrl && !imageError ? (
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                fill
                className={`object-cover transition-transform duration-300 ${
                  !showLikesPopup && !showViewsPopup
                    ? "group-hover:scale-105"
                    : ""
                }`}
                onError={() => {
                  console.error("Image failed to load:", destination.imageUrl);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏔️</div>
                  <div className="text-sm font-medium">{destination.name}</div>
                </div>
              </div>
            )}
            {/* Category and Subcategory Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <Badge className="bg-blue-500/90 text-white text-xs px-2 py-1">
                {destination.category.name}
              </Badge>
              {destination.subcategory && (
                <Badge className="bg-green-500/90 text-white text-xs px-2 py-1">
                  {destination.subcategory.name}
                </Badge>
              )}
            </div>
            {/* Simple hover overlay */}
            <div
              className={`absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center ${
                !showLikesPopup && !showViewsPopup
                  ? "group-hover:bg-black/20"
                  : ""
              }`}
            >
              <div
                className={`transition-opacity duration-300 ${
                  !showLikesPopup && !showViewsPopup
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-0"
                }`}
              >
                <div className="bg-white/90 rounded-full px-4 py-2">
                  <span className="text-sm font-medium text-gray-800">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-6 bg-white flex-1 flex flex-col">
          {/* Title with Location Icon */}
          <Link href={`/destinations/${destination.id}`} className="block">
            <div className="flex items-center gap-2 mb-3 cursor-pointer group">
              <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {destination.name}
              </h3>
            </div>
          </Link>

          {/* Description - Two lines with ellipsis */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          {/* Details List */}
          <div className="space-y-3 mb-6">
            {destination.startDate && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{destination.startDate}</span>
              </div>
            )}

            {destination.duration && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{destination.duration}</span>
              </div>
            )}

            {destination.distance && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{destination.distance}</span>
              </div>
            )}

            {destination.pickupLocation && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {destination.pickupLocation}
                </span>
              </div>
            )}
          </div>

          {/* Like and View Counts */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLike();
                }}
                disabled={isLiking}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked ? "fill-current text-red-600" : "text-gray-600"
                  }`}
                />
                <span className="font-medium">{likeCount}</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowViewsPopup(true);
                }}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  destination.isViewed
                    ? "bg-green-100 text-green-600 hover:bg-green-200 border border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <Eye
                  className={`h-4 w-4 ${
                    destination.isViewed ? "text-green-600" : "text-gray-600"
                  }`}
                />
                <span className="font-medium">{viewCount}</span>
              </button>
            </div>

            {likeCount > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLikesPopup(true);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                View likes
              </button>
            )}
          </div>

          {/* Price and Book Now Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-orange-600">
                  ₹
                  {(
                    destination.finalPrice || destination.price
                  ).toLocaleString()}
                </span>
              </div>
              {destination.basePrice &&
                destination.finalPrice &&
                destination.basePrice !== destination.finalPrice && (
                  <div className="text-xs text-gray-500">
                    Base: ₹{destination.basePrice.toLocaleString()}
                    {destination.markupPercentage && (
                      <span className="ml-2 text-green-600">
                        (+{destination.markupPercentage}% markup)
                      </span>
                    )}
                  </div>
                )}
            </div>

            <div className="flex gap-2">
              {editHref && (
                <Link href={editHref}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              )}
              {viewHref && (
                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Popups */}
      <Portal>
        <LikesPopup
          destinationId={destination.id}
          destinationName={destination.name}
          destinationImage={destination.imageUrl || undefined}
          isOpen={showLikesPopup}
          onClose={() => setShowLikesPopup(false)}
        />
      </Portal>

      <Portal>
        <ViewsPopup
          destinationId={destination.id}
          destinationName={destination.name}
          destinationImage={destination.imageUrl || undefined}
          isOpen={showViewsPopup}
          onClose={() => setShowViewsPopup(false)}
        />
      </Portal>
    </motion.div>
  );
}
