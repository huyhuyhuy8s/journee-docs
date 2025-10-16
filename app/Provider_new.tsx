"use client";

import Loader from "@/components/Loader";
import { useUserApi } from "@/lib/api";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode, useCallback, useRef } from "react";

// Standalone API function that doesn't use React hooks
const fetchUserById = async (userId: string, token: string | null) => {
  try {
    if (!token) {
      console.log("🔍 No auth token available for user fetch");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(
        "🔍 User fetch failed:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    console.log("🔍 User fetch successful:", data);
    return data;
  } catch (error) {
    console.error("🔍 Error fetching user:", error);
    return null;
  }
};

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const { searchUsers } = useUserApi();

  // Add throttling for mention suggestions
  const mentionThrottleRef = useRef<NodeJS.Timeout | null>(null);

  // Simple cache for user resolution to avoid repeated API calls
  const userCacheRef = useRef<Map<string, any>>(new Map());

  const throttledMentionSearch = useCallback(
    async (text: string, roomId: string) => {
      try {
        if (!text) return [];
        const users = await searchUsers(text, 10);
        return users.map((user: any) => user.email);
      } catch (error) {
        console.error("Error resolving mention suggestions:", error);
        return [];
      }
    },
    [searchUsers]
  );

  // Generate a consistent color for each user ID
  const getConsistentColor = useCallback((id: string) => {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ];

    const colorIndex = Math.abs(hashCode(id)) % colors.length;
    return colors[colorIndex];
  }, []);

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        console.log("🔍 Provider - resolveUsers called with:", userIds);
        try {
          // Get the current auth token
          const token = await getToken();

          // First, try to get current user info if it's in the list
          const resolvedUsers = await Promise.all(
            userIds.map(async (id) => {
              console.log("🔍 Provider - resolving user:", id);

              // If this is the current user, use their Clerk info
              if (clerkUser && id === clerkUser.id) {
                console.log("🔍 Provider - using current user Clerk data");
                return {
                  id,
                  name:
                    clerkUser.fullName ||
                    `${clerkUser.firstName || ""} ${
                      clerkUser.lastName || ""
                    }`.trim() ||
                    clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
                    `User ${id.slice(-8)}`,
                  email:
                    clerkUser.emailAddresses[0]?.emailAddress ||
                    `${id}@example.com`,
                  avatar: clerkUser.imageUrl || "",
                  color: getConsistentColor(id),
                };
              }

              // For other users, try to fetch from backend
              try {
                // Check cache first
                if (userCacheRef.current.has(id)) {
                  console.log("🔍 Provider - using cached user data for:", id);
                  return userCacheRef.current.get(id);
                }

                console.log("🔍 Provider - fetching user from backend:", id);
                const userInfo = await fetchUserById(id, token);

                if (userInfo && userInfo.success && userInfo.data) {
                  const userData = userInfo.data;
                  const resolvedUser = {
                    id,
                    name:
                      userData.fullName ||
                      `${userData.firstName || ""} ${
                        userData.lastName || ""
                      }`.trim() ||
                      userData.emailAddresses?.[0]?.emailAddress?.split(
                        "@"
                      )[0] ||
                      `User ${id.slice(-8)}`,
                    email:
                      userData.emailAddresses?.[0]?.emailAddress ||
                      `${id}@example.com`,
                    avatar: userData.imageUrl || "",
                    color: getConsistentColor(id),
                  };

                  console.log("🔍 Provider - resolved user:", resolvedUser);
                  // Cache the result
                  userCacheRef.current.set(id, resolvedUser);
                  return resolvedUser;
                }

                // Fallback if user not found or API failed
                console.log("🔍 Provider - using fallback for:", id);
                const fallbackUser = {
                  id,
                  name: `User ${id.slice(-8)}`,
                  email: `${id}@example.com`,
                  avatar: "",
                  color: getConsistentColor(id),
                };

                // Cache the fallback too
                userCacheRef.current.set(id, fallbackUser);
                return fallbackUser;
              } catch (error) {
                // Fallback for individual user lookup failure
                console.error("🔍 Provider - error fetching user:", id, error);
                const fallbackUser = {
                  id,
                  name: `User ${id.slice(-8)}`,
                  email: `${id}@example.com`,
                  avatar: "",
                  color: getConsistentColor(id),
                };

                // Cache the fallback
                userCacheRef.current.set(id, fallbackUser);
                return fallbackUser;
              }
            })
          );

          console.log("🔍 Provider - final resolved users:", resolvedUsers);
          return resolvedUsers;
        } catch (error) {
          console.error("Error resolving users:", error);
          return userIds.map((id) => ({
            id,
            name: `User ${id.slice(-8)}`,
            email: `${id}@example.com`,
            avatar: "",
            color: getConsistentColor(id),
          }));
        }
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        // Clear previous timeout
        if (mentionThrottleRef.current) {
          clearTimeout(mentionThrottleRef.current);
        }

        // Return a promise that resolves after a short delay
        return new Promise((resolve) => {
          mentionThrottleRef.current = setTimeout(async () => {
            const result = await throttledMentionSearch(text, roomId);
            resolve(result);
          }, 300); // 300ms debounce
        });
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
