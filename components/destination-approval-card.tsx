"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToastActions } from "@/lib/toast-actions";
import Link from "next/link";
import { MapPin, User, Calendar, DollarSign, Star } from "lucide-react";

interface DestinationApprovalCardProps {
  destination: {
    id: string;
    name: string;
    description: string;
    location: string;
    price: number;
    rating: number;
    imageUrl?: string;
    status: string;
    createdAt: Date;
    category: {
      name: string;
    };
    subcategory: {
      name: string;
    };
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
    approvedBy?: {
      name: string;
    };
    approvedAt?: Date;
    rejectionReason?: string;
  };
}

export function DestinationApprovalCard({
  destination,
}: DestinationApprovalCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { handleSuccess, handleError } = useToastActions();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `/api/destinations/${destination.id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "APPROVE" }),
        }
      );

      if (response.ok) {
        handleSuccess("Destination approved successfully");
        window.location.reload();
      } else {
        const error = await response.json();
        handleError("Failed to approve destination", error.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      handleError("Failed to approve destination", "Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      handleError("Rejection reason is required");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await fetch(
        `/api/destinations/${destination.id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      if (response.ok) {
        handleSuccess("Destination rejected successfully");
        window.location.reload();
      } else {
        const error = await response.json();
        handleError("Failed to reject destination", error.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      handleError("Failed to reject destination", "Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{destination.name}</CardTitle>
          {getStatusBadge(destination.status)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Created by {destination.createdBy.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        {destination.imageUrl && (
          <div className="mb-4">
            <Image
              src={destination.imageUrl}
              alt={destination.name}
              width={400}
              height={192}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{destination.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>${destination.price}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4" />
            <span>{destination.rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(destination.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-3 line-clamp-3">
          {destination.description}
        </p>

        <div className="mt-3 text-sm">
          <span className="text-gray-600">Category: </span>
          <span className="font-medium">{destination.category.name}</span>
          <br />
          <span className="text-gray-600">Subcategory: </span>
          <span className="font-medium">{destination.subcategory.name}</span>
        </div>

        {destination.status === "REJECTED" && destination.rejectionReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Rejection Reason:</strong> {destination.rejectionReason}
            </p>
          </div>
        )}

        {destination.status === "APPROVED" && destination.approvedBy && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Approved by:</strong> {destination.approvedBy.name}
              {destination.approvedAt && (
                <span>
                  {" "}
                  on {new Date(destination.approvedAt).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        )}

        {destination.status === "PENDING" && (
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="rejection-reason">
                Rejection Reason (if rejecting)
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                variant="destructive"
                className="flex-1"
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Link href={`/destinations/${destination.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
