'use client';

import { useRouter } from "next/navigation";
import AddDocumentBtn from "@/components/AddDocumentBtn";

interface EmptyStateActionsProps {
  type: 'noResults' | 'noDocuments';
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  userId?: string;
  email?: string;
}

const EmptyStateActions = ({ 
  type, 
  search, 
  sortBy, 
  sortOrder, 
  dateFrom, 
  dateTo, 
  limit,
  userId,
  email 
}: EmptyStateActionsProps) => {
  const router = useRouter();

  const clearSearch = () => {
    const params = new URLSearchParams();
    // Keep other filters but remove search
    if (sortBy && sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder && sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (limit && limit !== 10) params.set("limit", limit.toString());
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/');
  };

  if (type === 'noResults') {
    return (
      <div className="flex gap-3">
        {search && (
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear search
          </button>
        )}
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-dark-400 text-white rounded-lg hover:bg-dark-300 transition-colors border border-dark-300"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  if (type === 'noDocuments' && userId && email) {
    return (
      <AddDocumentBtn
        userId={userId}
        email={email}
      />
    );
  }

  return null;
};

export default EmptyStateActions;