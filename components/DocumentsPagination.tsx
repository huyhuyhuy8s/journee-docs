'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const DocumentsPagination = ({ currentPage, totalPages, totalCount, limit }: DocumentsPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`?${params.toString()}`);
  };

  const changeLimit = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-dark-200 rounded-lg">
      {/* Info */}
      <div className="text-sm text-gray-400">
        Showing {startItem} to {endItem} of {totalCount} documents
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-dark-400 border-dark-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-gray-400">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigateToPage(page as number)}
                  className={page === currentPage 
                    ? "bg-blue-600 text-white" 
                    : "bg-dark-400 border-dark-300"
                  }
                >
                  {page}
                </Button>
              )}
            </span>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-dark-400 border-dark-300"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Items per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Per page:</span>
        <Select value={limit.toString()} onValueChange={changeLimit}>
          <SelectTrigger className="w-20 bg-dark-400 border-dark-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DocumentsPagination;