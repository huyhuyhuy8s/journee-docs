import { getUserColor } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  try {
    const { getToken } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    // For server-side API routes, we need to get the backend URL from environment
    // Try NEXT_PUBLIC_API_URL first, then fallback to API_URL, then default
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      "http://localhost:5001";
    console.log("Backend URL:", backendUrl);
    console.log("Full URL:", `${backendUrl}/api/auth/liveblocks`);

    // Call the backend API for Liveblocks authentication
    const response = await fetch(`${backendUrl}/api/auth/liveblocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend API error: ${response.status}`, errorText);
      throw new Error(`Backend API error: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.log("Non-JSON response:", text);
      throw new Error("Backend did not return JSON response");
    }

    const data = await response.json();
    console.log("Parsed response data:", data);

    // Pass through the response directly from backend (should be in correct Liveblocks format)
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error authenticating with Liveblocks via backend:", error);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
