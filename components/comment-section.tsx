"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Comment {
  id: string;
  content: string;
  rating: number | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  destinationId: string;
  comments: Comment[];
  canComment: boolean;
  isLoggedIn?: boolean;
}

export function CommentSection({
  destinationId,
  comments,
  canComment,
  isLoggedIn = false,
}: CommentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/destinations/${destinationId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            rating: newRating ? parseInt(newRating) : null,
          }),
        }
      );

      if (response.ok) {
        setNewComment("");
        setNewRating("");
        // Refresh the page to show new comment
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {canComment ? (
        <Card>
          <CardHeader>
            <CardTitle>Add a Comment</CardTitle>
            <CardDescription>
              Share your experience and rate this destination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (Optional)</Label>
                <Select value={newRating} onValueChange={setNewRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Comment *</Label>
                <Textarea
                  id="content"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center">
              {!isLoggedIn
                ? "Please log in to add a comment"
                : "You cannot comment on your own destination"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {comment.user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.user.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {comment.rating !== null && (
                      <div className="text-sm">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={
                              i < comment.rating!
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
