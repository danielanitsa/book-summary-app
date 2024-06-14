import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import ClientSearchInput from "./MainSearchInput.client";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { db } from "@/db/db";

export default async function SharedLayout({
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
  const session = await auth();

  const basePath = query ? `/search/${query}/page/` : `/page/`;
  const previousPageLink = `${basePath}${currentPage - 1}`;
  const nextPageLink = `${basePath}${currentPage + 1}`;

  const dbImage = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      image: true,
    },
  });

  const userImage = dbImage?.image || session?.user.image;
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-row">
          <ClientSearchInput placeholder="Search for book..." />

          {userImage ? (
            <div className="ml-4">
              <Image
                src={userImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full hover:scale-125 transition-all cursor-pointer"
                priority
              />
            </div>
          ) : null}
        </nav>
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
