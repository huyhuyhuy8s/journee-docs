import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export const useApiClient = () => {
  const { getToken } = useAuth();

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      console.log(`✅ API Call successful: ${endpoint}`, response.status);
      return response;
    },
    [getToken]
  );

  // Helper function to handle wrapped API responses
  const handleApiResponse = useCallback(async (response: Response) => {
    const responseData = await response.json();

    // Extract the actual data from the success wrapper if present
    if (responseData.success && responseData.data !== undefined) {
      return responseData.data;
    }

    // Return the response as-is if it's not wrapped
    return responseData;
  }, []);

  return { apiCall, handleApiResponse };
};

// Document API functions
export const useDocumentApi = () => {
  const { apiCall } = useApiClient();

  const createDocument = useCallback(
    async (title: string) => {
      const response = await apiCall("/api/documents", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      const responseData = await response.json();

      // Extract the actual data from the success wrapper
      if (responseData.success && responseData.data) {
        return responseData.data;
      }

      return responseData;
    },
    [apiCall]
  );

  const getDocuments = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      dateFrom?: string;
      dateTo?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const endpoint = `/api/documents${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      console.log("📄 Frontend API: Calling endpoint:", endpoint);
      const response = await apiCall(endpoint);
      const responseData = await response.json();
      console.log("📄 Frontend API: Documents response:", responseData);

      // Extract the actual data from the success wrapper
      if (responseData.success && responseData.data) {
        return responseData.data;
      }

      // Fallback to the response as-is if it's not wrapped
      return responseData;
    },
    [apiCall]
  );

  const getDocument = useCallback(
    async (id: string) => {
      const response = await apiCall(`/api/documents/${id}`);
      const responseData = await response.json();

      // Extract the actual data from the success wrapper
      if (responseData.success && responseData.data) {
        return responseData.data;
      }

      return responseData;
    },
    [apiCall]
  );

  const updateDocument = useCallback(
    async (
      id: string,
      updates: { title?: string; collaborators?: string[] }
    ) => {
      const response = await apiCall(`/api/documents/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    [apiCall]
  );

  const deleteDocument = useCallback(
    async (id: string) => {
      const response = await apiCall(`/api/documents/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    [apiCall]
  );

  const renameDocument = useCallback(
    async (id: string, title: string) => {
      const response = await apiCall(`/api/documents/${id}/rename`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      return response.json();
    },
    [apiCall]
  );

  const inviteCollaborator = useCallback(
    async (
      id: string,
      email: string,
      permission: "room:read" | "room:write" = "room:write"
    ) => {
      const response = await apiCall(`/api/documents/${id}/invite`, {
        method: "POST",
        body: JSON.stringify({ email, permission }),
      });
      return response.json();
    },
    [apiCall]
  );

  const removeCollaborator = useCallback(
    async (id: string, userId: string) => {
      const response = await apiCall(
        `/api/documents/${id}/collaborators/${userId}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    },
    [apiCall]
  );

  return {
    createDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
    renameDocument,
    inviteCollaborator,
    removeCollaborator,
  };
};

// User API functions
export const useUserApi = () => {
  const { apiCall } = useApiClient();

  const searchUsers = useCallback(
    async (query: string, limit?: number) => {
      const params = new URLSearchParams({ q: query });
      if (limit) params.append("limit", limit.toString());

      const response = await apiCall(`/api/users/search?${params.toString()}`);
      return response.json();
    },
    [apiCall]
  );

  const getUserById = useCallback(
    async (userId: string) => {
      try {
        const response = await apiCall(`/api/users/${userId}`);
        return response.json();
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
      }
    },
    [apiCall]
  );

  const getCurrentUser = useCallback(async () => {
    const response = await apiCall("/api/auth/me");
    return response.json();
  }, [apiCall]);

  return {
    searchUsers,
    getUserById,
    getCurrentUser,
  };
};

// Auth API functions
export const useAuthApi = () => {
  const { apiCall } = useApiClient();

  const authenticateWithLiveblocks = useCallback(async () => {
    const response = await apiCall("/api/auth/liveblocks", {
      method: "POST",
    });
    return response.json();
  }, [apiCall]);

  return {
    authenticateWithLiveblocks,
  };
};
