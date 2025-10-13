"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(
        `https://christiana-ungovernable-miranda.ngrok-free.dev/chat?query=${encodedQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch FAQ data");
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
                  Error: {error}
                </div>
              )}

              {response && (
                <div className="flex-1 border rounded-md p-4 overflow-y-auto bg-gray-50">
                  <div className="whitespace-pre-wrap text-sm text-gray-900">
                    {response}
                  </div>
                </div>
              )}

              {!response && !loading && !error && (
                <div className="text-center py-8 text-gray-500">
                  Enter a question to search the FAQ
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
