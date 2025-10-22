"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditUserDialog } from "@/components/edit-user-dialog";
import { Edit } from "lucide-react";

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

interface UserDetailsActionsProps {
  user: User;
}

export function UserDetailsActions({ user }: UserDetailsActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <div className="pt-4 border-t">
        <Button
          onClick={() => setShowEditDialog(true)}
          variant="outline"
          className="w-full"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      {showEditDialog && (
        <EditUserDialog
          user={user}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
}
