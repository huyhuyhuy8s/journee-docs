import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import { useDocumentApi } from "@/lib/api";

const Collaborator = ({
  roomId,
  creatorId,
  collaborator,
  email,
  user,
}: CollaboratorProps) => {
  const [userType, setUserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);
  const { removeCollaborator, inviteCollaborator } = useDocumentApi();

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    try {
      const permission = type === "viewer" ? "room:read" : "room:write";
      await inviteCollaborator(
        roomId,
        email,
        permission as "room:read" | "room:write"
      );
    } catch (error) {
      console.error("Error updating collaborator:", error);
    }

    setLoading(false);
  };

  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);

    try {
      // Note: We need to get the user ID from email for this API call
      // For now, using email as fallback - this might need adjustment based on backend
      await removeCollaborator(roomId, collaborator.id || email);
    } catch (error) {
      console.error("Error removing collaborator:", error);
    }

    setLoading(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const hasValidAvatar =
    collaborator.avatar &&
    collaborator.avatar.trim() !== "" &&
    collaborator.avatar !== "undefined" &&
    collaborator.avatar !== "null";

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        {hasValidAvatar ? (
          <Image
            src={collaborator.avatar}
            alt={collaborator.name || collaborator.email || "User avatar"}
            width={36}
            height={36}
            className="size-9 rounded-full"
            onError={(e) => {
              // Hide the image and show fallback
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="size-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold"
          style={{ display: hasValidAvatar ? "none" : "flex" }}
        >
          {getInitials(collaborator.name || collaborator.email || "U")}
        </div>
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name || "Unknown User"}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email || "No email"}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || "viewer"}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default Collaborator;
