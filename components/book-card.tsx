import { Book } from "@/lib/book";
import React, { Suspense } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import BookSkeleton from "./book-skeleton";

interface BookCardProps {
  books: Book[];
}

const BookCard: React.FC<BookCardProps> = async ({ books }) => {
  return (
    <>
      {books.map((book) => (
        <Suspense
          fallback={<BookSkeleton />}
          key={book.key + Math.floor(Math.random() * 120)}
        >
          <Card
            key={book.key}
            className="flex flex-col transition-all hover:scale-110"
          >
            <CardHeader className="p-4">
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                      : "https://placehold.co/400.webp"
                  }
                  alt={book.title}
                  quality={100}
                  className="rounded-lg object-cover"
                  fill
                  loading="lazy"
                  sizes="50vw"
                />
              </div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm ">{book.author_name?.join(", ")}</p>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <p className="text-sm text-muted-foreground">
                <strong>First published:</strong>{" "}
                {book.first_publish_year || "N/A"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                <strong>Categories:</strong>{" "}
                {truncateText(book.subject?.join(", ") || "N/A")}
              </p>
            </CardContent>
            <CardFooter className="p-4">
              <Link
                href={`/summary/book/${encodeURI(book.title)}/author/${book.author_name}/isbn/${book.isbn && book.isbn["0"] ? book.isbn["0"] : "no isbn was found"}/cover-id/${book.cover_i}`}
                className="text-blue-500 hover:underline"
              >
                More Info
              </Link>
            </CardFooter>
          </Card>
        </Suspense>
      ))}
    </>
  );
};

function truncateText(description: string) {
  const maxLength = 200;
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

export default BookCard;
