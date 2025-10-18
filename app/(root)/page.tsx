"use client";

import AddDocumentBtn from "@/components/AddDocumentBtn";
import { DeleteModal } from "@/components/DeleteModal";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import DocumentsFilterToggle from "@/components/DocumentsFilterToggle";
import DocumentsPagination from "@/components/DocumentsPagination";
import EmptyState from "@/components/EmptyState";
import { useDocumentApi } from "@/lib/api";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface HomeProps {
  searchParams: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const Home = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getDocuments } = useDocumentApi();
  const searchParams = useSearchParams();

  const [roomDocuments, setRoomDocuments] = useState<any>({
    data: [],
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract search parameters with defaults
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  // Function to handle document deletion and refresh the list
  const handleDocumentDelete = async (deletedRoomId: string) => {
    try {
      // Remove the deleted document from the current state immediately for better UX
      setRoomDocuments((prev: any) => ({
        ...prev,
        data: prev.data.filter((doc: any) => doc.id !== deletedRoomId),
        totalCount: prev.totalCount - 1,
      }));

      // If this was the last document on a page other than the first, go to previous page
      if (roomDocuments.data.length === 1 && page > 1) {
        const newPage = page - 1;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("page", newPage.toString());
        window.history.pushState({}, "", newUrl.toString());

        // The useEffect will trigger a refetch when the URL changes
      }
    } catch (error) {
      console.error("Error handling document deletion:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      redirect("/sign-in");
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const documents = await getDocuments({
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          dateFrom,
          dateTo,
        });

        // console.log("📄 Frontend: Raw documents response:", documents);
        // console.log("📄 Frontend: Documents data:", documents?.data);
        // console.log("📄 Frontend: Documents count:", documents?.totalCount);

        setRoomDocuments(documents);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch documents"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [
    isLoaded,
    isSignedIn,
    getDocuments,
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    dateFrom,
    dateTo,
  ]);

  if (!isLoaded || !clerkUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/sign-in");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if any filters are active
  const hasActiveFilters =
    search ||
    dateFrom ||
    dateTo ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc" ||
    limit !== 10;

  // Check if we have any filters applied but no results
  const hasFiltersButNoResults =
    hasActiveFilters && roomDocuments.data.length === 0;

  // Check if there are no documents at all (no filters, no results)
  const hasNoDocumentsAtAll =
    !hasActiveFilters && roomDocuments.data.length === 0;

  if (roomDocuments.data.length > 0) {
    console.log("Documents found:", roomDocuments.data);
  } else {
    console.log("No documents found.");
  }

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      <div className="document-list-container">
        <div className="document-list-title">
          <h3 className="text-28-semibold">
            All documents ({roomDocuments.totalCount})
          </h3>
          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>

        {/* Filter Toggle - Only visible when there are documents or active filters */}
        {(roomDocuments.data.length > 0 || hasActiveFilters) && (
          <div className="flex items-center gap-3 w-full max-w-[730px]">
            <DocumentsFilterToggle
              currentFilters={{
                search,
                sortBy,
                sortOrder,
                dateFrom,
                dateTo,
                limit,
              }}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {roomDocuments.data.length ? (
          <>
            <ul className="document-ul">
              {roomDocuments.data.map(({ id, title, createdAt }: any) => (
                <li key={id} className="document-list-item">
                  <Link
                    href={`/documents/${id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{title}</p>
                      <p className="text-sm font-light text-blue-100">
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} onDelete={handleDocumentDelete} />
                </li>
              ))}
            </ul>

            {/* Pagination Component */}
            <DocumentsPagination
              currentPage={page}
              totalPages={Math.ceil(roomDocuments.totalCount / limit)}
              totalCount={roomDocuments.totalCount}
              limit={limit}
            />
          </>
        ) : (
          <EmptyState
            hasFiltersButNoResults={hasFiltersButNoResults as boolean}
            hasNoDocumentsAtAll={hasNoDocumentsAtAll}
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            dateFrom={dateFrom}
            dateTo={dateTo}
            limit={limit}
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
