import { auth, currentUser } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function serverApiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    // First try to get a session token
    const { getToken, userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Try to get a token with longer expiration
    let token;
    try {
      token = await getToken({
        template: "integration_default",
      });
    } catch (tokenError) {
      console.warn(
        "Could not get integration token, trying default:",
        tokenError
      );
      token = await getToken();
    }

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API call failed: ${response.status} ${response.statusText}`,
        errorText
      );
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Server API call error:", error);
    throw error;
  }
}

// Server-side document API functions
export async function getDocumentsServer(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
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
  return await serverApiCall(endpoint);
}

export async function getDocumentServer(id: string) {
  return await serverApiCall(`/api/documents/${id}`);
}

export async function deleteDocumentServer(id: string) {
  return await serverApiCall(`/api/documents/${id}`, {
    method: "DELETE",
  });
}
