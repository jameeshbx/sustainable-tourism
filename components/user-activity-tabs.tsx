"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Eye,
  MessageSquare,
  Globe,
  MapPin,
  ExternalLink,
  User,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string | null;
  createdAt: Date;
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  } | null;
  _count: {
    likes: number;
    comments: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  destination: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

interface UserActivityTabsProps {
  user: UserData;
  likedDestinations: Destination[];
  viewedDestinations: Destination[];
  userComments: Comment[];
  userDestinations: Destination[];
}

export function UserActivityTabs({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user: _user,
  likedDestinations,
  viewedDestinations,
  userComments,
  userDestinations,
}: UserActivityTabsProps) {
  const [activeTab, setActiveTab] = useState("liked");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const DestinationCard = ({ destination }: { destination: Destination }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {destination.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {destination.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {destination.category.name}
                    </Badge>
                    {destination.subcategory && (
                      <Badge variant="outline" className="text-xs">
                        {destination.subcategory.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-sm font-semibold text-green-600">
                    ₹{destination.price.toLocaleString()}
                  </span>
                  <Link href={`/destinations/${destination.id}`}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{destination._count.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{destination._count.comments}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(destination.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CommentCard = ({ comment }: { comment: Comment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {comment.destination.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={comment.destination.imageUrl}
                  alt={comment.destination.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Comment on {comment.destination.name}
                  </h4>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                    {comment.content}
                  </p>
                </div>
                <Link href={`/destinations/${comment.destination.id}`}>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-400">
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>User Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="liked" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Liked ({likedDestinations.length})</span>
            </TabsTrigger>
            <TabsTrigger value="viewed" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Viewed ({viewedDestinations.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comments ({userComments.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="created"
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Created ({userDestinations.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked" className="mt-6">
            <div className="space-y-4">
              {likedDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No liked destinations yet</p>
                </div>
              ) : (
                likedDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="viewed" className="mt-6">
            <div className="space-y-4">
              {viewedDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No viewed destinations yet</p>
                </div>
              ) : (
                viewedDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <div className="space-y-4">
              {userComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No comments yet</p>
                </div>
              ) : (
                userComments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="created" className="mt-6">
            <div className="space-y-4">
              {userDestinations.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No created destinations yet</p>
                </div>
              ) : (
                userDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
