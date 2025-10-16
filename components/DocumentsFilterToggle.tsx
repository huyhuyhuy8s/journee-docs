"use client";

import { Button } from "@/components/ui/button";
import DocumentsFilter from "@/components/DocumentsFilter";
import { useState } from "react";
import { Filter, FilterX, ChevronDown, ChevronUp } from "lucide-react";
import DocumentsSearchBar from "./DocumentsSearchBar";

interface DocumentsFilterToggleProps {
  currentFilters: {
    search: string;
    sortBy: string;
    sortOrder: string;
    dateFrom: string;
    dateTo: string;
    limit: number;
  };
  hasActiveFilters: boolean | string;
}

const DocumentsFilterToggle = ({
  currentFilters,
  hasActiveFilters,
}: DocumentsFilterToggleProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const search = currentFilters.search;

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <div className="w-full max-w-[730px] flex items-start justify-center gap-3">
        <div className="flex flex-col">
          <Button
            onClick={toggleFilter}
            variant="outline"
            className={`
            flex items-center gap-2 transition-all duration-200 h-12
            ${
              hasActiveFilters
                ? "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
                : "bg-dark-400 border-dark-300 hover:bg-dark-300"
            }
          `}
          >
            {hasActiveFilters ? (
              <FilterX className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
            <span>
              Filter
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  Active
                </span>
              )}
            </span>
            {isFilterOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          {/* Active Filters Summary */}
          {hasActiveFilters && !isFilterOpen && (
            <div className="mt-2 flex flex-wrap gap-2">
              {currentFilters.search && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
                  Search: {currentFilters.search}
                </span>
              )}
              {currentFilters.dateFrom && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
                  From: {currentFilters.dateFrom}
                </span>
              )}
              {currentFilters.dateTo && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
                  To: {currentFilters.dateTo}
                </span>
              )}
              {(currentFilters.sortBy !== "createdAt" ||
                currentFilters.sortOrder !== "desc") && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
                  Sort: {currentFilters.sortBy} ({currentFilters.sortOrder})
                </span>
              )}
              {currentFilters.limit !== 10 && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full">
                  Show: {currentFilters.limit}
                </span>
              )}
            </div>
          )}
        </div>

        <DocumentsSearchBar
          currentSearch={search}
          isFilterOpen={isFilterOpen}
        />
      </div>

      {/* Filter Panel with Animation */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${
            isFilterOpen
              ? "max-h-96 opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }
        `}
      >
        <DocumentsFilter currentFilters={currentFilters} />
      </div>
    </div>
  );
};

export default DocumentsFilterToggle;
