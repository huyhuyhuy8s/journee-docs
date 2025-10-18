"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFAQData = async (searchQuery: string) => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/api/faq/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `HTTP error! status: ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to get FAQ response");
      }

      setResponse(data.data.answer);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch FAQ data";
      setError(errorMessage);
      console.error("FAQ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchFAQData(query.trim());
    }
  };

  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1">
        <Image
          src="/assets/icons/logo.svg"
          alt="Logo with name"
          width={120}
          height={32}
          className="hidden md:block"
        />
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>

      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
      >
        FAQ
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Frequently Asked Questions
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>Error:</strong> {error}
                    </div>
                    {!loading && (
                      <button
                        onClick={() => fetchFAQData(query.trim())}
                        className="text-sm underline hover:no-underline ml-2 flex-shrink-0"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}

              {response && (
                <div className="flex-1 border rounded-md p-4 overflow-y-auto bg-gray-50">
                  <div className="prose prose-sm max-w-none text-gray-900">
                    {response.split("\n").map((line, index) => {
                      // Handle bold text (markdown-style **text**)
                      if (line.includes("**")) {
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        return (
                          <p key={index} className="mb-2">
                            {parts.map((part, partIndex) =>
                              partIndex % 2 === 1 ? (
                                <strong key={partIndex}>{part}</strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        );
                      }
                      // Handle bullet points
                      if (line.trim().startsWith("•")) {
                        return (
                          <p key={index} className="mb-1 ml-4">
                            {line}
                          </p>
                        );
                      }
                      // Handle empty lines
                      if (line.trim() === "") {
                        return <br key={index} />;
                      }
                      // Regular text
                      return (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}

              {!response && !loading && !error && (
                <div className="text-center py-8 text-gray-500 space-y-4">
                  <p>Enter a question to search the FAQ</p>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 mb-2">
                      Try asking:
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() =>
                          setQuery("How do I create a new document?")
                        }
                        className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                      >
                        &ldquo;How do I create a new document?&rdquo;
                      </button>
                      <button
                        onClick={() => setQuery("How do I share a document?")}
                        className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                      >
                        &ldquo;How do I share a document?&rdquo;
                      </button>
                      <button
                        onClick={() => setQuery("How do I add comments?")}
                        className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                      >
                        &ldquo;How do I add comments?&rdquo;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default Header;
