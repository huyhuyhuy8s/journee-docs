import Image from "next/image";
import EmptyStateActions from "@/components/EmptyStateActions";

interface EmptyStateProps {
  hasFiltersButNoResults: boolean;
  hasNoDocumentsAtAll: boolean;
  search: string;
  sortBy: string;
  sortOrder: string;
  dateFrom: string;
  dateTo: string;
  limit: number;
  userId: string;
  email: string;
}

const EmptyState = ({
  hasFiltersButNoResults,
  hasNoDocumentsAtAll,
  search,
  sortBy,
  sortOrder,
  dateFrom,
  dateTo,
  limit,
  userId,
  email,
}: EmptyStateProps) => {
  return (
    <div className="document-list-empty">
      <div className="flex flex-col items-center justify-center py-12">
        <Image
          src="/assets/icons/doc.svg"
          alt="Document"
          width={60}
          height={60}
          className="mb-4 opacity-50"
        />

        {hasFiltersButNoResults ? (
          /* No results due to filters */
          <>
            <h4 className="text-xl font-semibold text-white mb-2">
              No documents found
            </h4>
            <p className="text-center text-gray-400 mb-4 max-w-md">
              {search
                ? `No documents match "${search}". Try adjusting your search term or filters.`
                : "No documents match your current filters. Try adjusting your filter criteria."}
            </p>
            <EmptyStateActions
              type="noResults"
              search={search}
              sortBy={sortBy}
              sortOrder={sortOrder}
              dateFrom={dateFrom}
              dateTo={dateTo}
              limit={limit}
            />
          </>
        ) : hasNoDocumentsAtAll ? (
          /* No documents created yet */
          <>
            <h4 className="text-xl font-semibold text-white mb-2">
              Welcome to LiveDocs
            </h4>
            <p className="text-center text-gray-400 mb-6 max-w-md">
              You have not created any documents yet. Start collaborating by
              creating your first document.
            </p>
            <EmptyStateActions
              type="noDocuments"
              userId={userId}
              email={email}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyState;
