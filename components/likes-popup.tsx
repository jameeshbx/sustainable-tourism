"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Heart, User } from "lucide-react";
import { useToastActions } from "@/lib/toast-actions";

interface Like {
  id: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    profileImage: string | null;
  };
}

interface LikesPopupProps {
  destinationId: string;
  destinationName?: string;
  destinationImage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LikesPopup({
  destinationId,
  destinationName,
  destinationImage,
  isOpen,
  onClose,
}: LikesPopupProps) {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { handleError } = useToastActions();
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchLikes = useCallback(
    async (pageNum: number = 1) => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/destinations/${destinationId}/likes?page=${pageNum}&limit=20`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch likes");
        }

        const data = await response.json();

        if (pageNum === 1) {
          setLikes(data.likes);
        } else {
          setLikes((prev) => [...prev, ...data.likes]);
        }

        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching likes:", error);
        handleError("Failed to load likes", "Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [loading, destinationId, handleError]
  );

  useEffect(() => {
    if (isOpen) {
      fetchLikes(1);
      setPage(1);
    }
  }, [isOpen, destinationId, fetchLikes]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLikes(nextPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{
        animation: "fadeIn 200ms ease-out",
      }}
      onClick={(e) => {
        // Only close if clicking the backdrop, not the card content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        ref={popupRef}
        className="w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl"
        style={{
          animation: "slideInScale 200ms ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Destination Header */}
        {destinationName && (
          <div className="relative h-32 bg-gradient-to-r from-red-500 to-pink-600 text-white">
            {destinationImage && (
              <Image
                src={destinationImage}
                alt={destinationName}
                fill
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="relative z-10 p-4 h-full flex flex-col justify-end">
              <h3 className="text-lg font-semibold truncate">
                {destinationName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Heart className="h-4 w-4" />
                <span className="text-sm opacity-90">Likes ({totalCount})</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Original Header (fallback) */}
        {!destinationName && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Likes ({totalCount})</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
        )}
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {likes.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No likes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {likes.map((like) => (
                <div
                  key={like.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    {like.user.profileImage || like.user.image ? (
                      <Image
                        src={like.user.profileImage || like.user.image || ""}
                        alt={like.user.name || "User"}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {like.user.name || "Anonymous User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(like.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    Liked
                  </Badge>
                </div>
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
