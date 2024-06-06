import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import ClientSearchInput from "./MainSearchInput.client";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SharedLayout({
  children,
  currentPage,
  query,
  hasMoreBooks,
}: {
  children: React.ReactNode;
  currentPage: number;
  query?: string;
  hasMoreBooks?: boolean;
}) {
  const basePath = query ? `/search/${query}/page/` : `/page/`;
  const previousPageLink = `${basePath}${currentPage - 1}`;
  const nextPageLink = `${basePath}${currentPage + 1}`;

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<h1>loading search bar...</h1>}>
          <ClientSearchInput placeholder="Search for book..." />
        </Suspense>
        <div className="py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children}
          </div>
        </div>
      </div>

      <div className="space-x-2 flex justify-center mt-2">
        {/* Server-side Pagination Controls */}
        <Button
          disabled={currentPage == 1}
          className="flex items-center justify-center"
        >
          <ChevronLeft size={20} className="mr-2" />
          <Link href={previousPageLink}>Previous</Link>
        </Button>
        <Button
          disabled={!hasMoreBooks}
          className="flex items-center justify-center"
        >
          <Link href={nextPageLink}>Next</Link>
          <ChevronRight size={20} className="ml-2" />
        </Button>
      </div>
    </>
  );
}
