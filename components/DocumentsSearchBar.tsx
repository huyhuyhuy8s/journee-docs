"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface DocumentsSearchBarProps {
  currentSearch: string;
  isFilterOpen: boolean;
}

const DocumentsSearchBar = ({
  currentSearch,
  isFilterOpen,
}: DocumentsSearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value.trim() !== "") {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    // Reset to page 1 when searching
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateSearch("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounced search - search as user types
    const timeoutId = setTimeout(() => {
      updateSearch(value);
    }, 500);

    // Cleanup timeout on next keystroke
    return () => clearTimeout(timeoutId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        <Input
          type="text"
          placeholder="Search documents by title..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 pr-10 h-12 bg-dark-400 border-dark-300 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-dark-300 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Search suggestions or active search indicator */}
      {currentSearch && !isFilterOpen && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-400">Searching for:</span>
          <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
            {currentSearch}
          </span>
          <button
            type="button"
            onClick={clearSearch}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            Clear search
          </button>
        </div>
      )}
    </form>
  );
};

export default DocumentsSearchBar;
