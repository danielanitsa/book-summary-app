import { GoogleBook } from "@/lib/book";
import Image from "next/image";
import React from "react";

interface BookInfoProps {
  book: GoogleBook | undefined;
  bookCover: string | undefined;
}

const BookInfo: React.FC<BookInfoProps> = ({ book, bookCover }) => {
  return (
    <>
      {book ? (
        <div className="shadow-md rounded-lg overflow-hidden py-4 md:flex md:space-x-6">
          {bookCover && (
            <div className="w-full md:w-1/3 flex items-center justify-center mx-auto">
              <Image
                src={bookCover}
                alt={book.volumeInfo.title}
                width={300}
                height={450}
                className="rounded-lg shadow-md"
                priority
                loading="eager"
              />
            </div>
          )}
          <div className="w-full md:w-2/3 space-y-4 mt-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold ">{book.volumeInfo.title}</h1>
              {book.volumeInfo.subtitle ? (
                <h1 className="text-xl font-semibold">
                  {book.volumeInfo.subtitle}
                </h1>
              ) : null}
            </div>
            <p className="text-lg font-semibold">
              Author: {book.volumeInfo.authors?.join(", ") || "N/A"}
            </p>
            <p className="text-md text-muted-foreground">
              <span className="text-white">Published Date:</span>{" "}
              {book.volumeInfo.publishedDate}
            </p>
            <p className="text-md text-muted-foreground">
              <span className="text-white font-normal">Categories:</span>{" "}
              {book.volumeInfo.categories?.join(", ") || "N/A"}
            </p>
            <p className="text-md text-muted-foreground">
              <span className="text-white">Description:</span>{" "}
              {book.volumeInfo.description || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center font-bold text-xl text-destructive-foreground">
          No book found.
        </p>
      )}
    </>
  );
};

export default BookInfo;
