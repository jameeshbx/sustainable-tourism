"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, User, UserCheck, Save, Calendar, Mail } from "lucide-react";
import { useToastActions } from "@/lib/toast-actions";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "SERVICE_PROVIDER" | "USER" | "SUPERADMIN";
  createdAt: Date;
  _count: {
    destinations: number;
    comments: number;
    likes: number;
    views: number;
  };
}

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserDialog({ user, isOpen, onClose }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    role: user.role,
  });
  const { handleSuccess, handleError } = useToastActions();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email,
        role: user.role,
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      await response.json();
      handleSuccess(
        "User updated",
        "User information has been successfully updated"
      );
      onClose();

      // Refresh the page to update the user list
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      handleError(
        "Failed to update user",
        error instanceof Error ? error.message : "Please try again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "SERVICE_PROVIDER":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Service Provider
          </Badge>
        );
      case "USER":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <User className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <User className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Edit User</span>
          </DialogTitle>
          <DialogDescription>
            Update user information and role permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Display */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>Email: {user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Joined: {formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Current Role:</span>
              {getRoleBadge(user.role)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Regular User</span>
                  </div>
                </SelectItem>
                <SelectItem value="SERVICE_PROVIDER">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span>Service Provider</span>
                  </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="SUPERADMIN">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Super Admin</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Activity Stats */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">User Activity</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Destinations:</span>
                <span className="ml-2 font-medium">
                  {user._count.destinations}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Comments:</span>
                <span className="ml-2 font-medium">{user._count.comments}</span>
              </div>
              <div>
                <span className="text-blue-700">Likes:</span>
                <span className="ml-2 font-medium">{user._count.likes}</span>
              </div>
              <div>
                <span className="text-blue-700">Views:</span>
                <span className="ml-2 font-medium">{user._count.views}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
