"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface DocumentsFilterProps {
  currentFilters: {
    search: string;
    sortBy: string;
    sortOrder: string;
    dateFrom: string;
    dateTo: string;
    limit: number;
  };
}

const DocumentsFilter = ({ currentFilters }: DocumentsFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(currentFilters);

  // Update local state when props change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);

    // Update or remove parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filtering
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Debounce search input
    if (key === "search") {
      setTimeout(() => updateURL(newFilters), 500);
    } else {
      updateURL(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      dateFrom: "",
      dateTo: "",
      limit: 10,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-dark-200 rounded-lg border border-dark-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white">Filter Documents</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-400 hover:text-white hover:bg-dark-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Main Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Search documents
          </label>
          <Input
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="bg-dark-400 border-dark-300 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Sort by
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="bg-dark-400 border-dark-300 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-400 border-dark-300">
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="lastModified">Last Modified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Order
          </label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => handleFilterChange("sortOrder", value)}
          >
            <SelectTrigger className="bg-dark-400 border-dark-300 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-400 border-dark-300">
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range & Items per page */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            From date
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="bg-dark-400 border-dark-300 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            To date
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="bg-dark-400 border-dark-300 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Items per page
          </label>
          <Select
            value={filters.limit.toString()}
            onValueChange={(value) =>
              handleFilterChange("limit", parseInt(value))
            }
          >
            <SelectTrigger className="bg-dark-400 border-dark-300 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-400 border-dark-300">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DocumentsFilter;
