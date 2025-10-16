"use client";

import CollaborativeRoom from "@/components/CollaborativeRoom";
import { useDocumentApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Document = ({ params: { id } }: SearchParamProps) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getDocument } = useDocumentApi();

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      redirect("/sign-in");
      return;
    }

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const document = await getDocument(id);
        setRoom(document);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch document"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [isLoaded, isSignedIn, getDocument, id]);

  if (!isLoaded || !clerkUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/sign-in");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading document...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    redirect("/");
    return null;
  }

  // Extract users from the room collaborators
  const users = room.collaborators || [];

  const usersData = users.map((user: any) => ({
    ...user,
    userType: user.permission === "room:write" ? "editor" : "viewer",
  }));

  // Find current user's permission - now using Clerk ID for consistency
  const currentUserCollaborator = users.find(
    (user: any) => user.id === clerkUser.id
  );
  const currentUserType =
    currentUserCollaborator?.permission === "room:write" ? "editor" : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={
          room.metadata || { title: room.title, creatorId: room.creatorId }
        }
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
