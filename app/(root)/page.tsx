import AddDocumentBtn from "@/components/AddDocumentBtn";
import { DeleteModal } from "@/components/DeleteModal";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import DocumentsFilterToggle from "@/components/DocumentsFilterToggle";
import DocumentsPagination from "@/components/DocumentsPagination";
import EmptyState from "@/components/EmptyState";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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

const Home = async ({ searchParams }: HomeProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Extract search parameters with defaults
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "5");
  const sortBy = searchParams.sortBy || "createdAt";
  const sortOrder = searchParams.sortOrder || "desc";
  const search = searchParams.search || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress,
    {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      dateFrom,
      dateTo,
    }
  );

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
              {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
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
                      <p className="line-clamp-1 text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100">
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
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
