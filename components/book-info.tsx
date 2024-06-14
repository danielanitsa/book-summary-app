import { Book, GoogleBook } from "@/lib/book";
import Image from "next/image";
import React from "react";

interface BookInfoProps {
  book: (GoogleBook & Book) | undefined;
  bookCover: string | undefined;
}

const BookInfo: React.FC<BookInfoProps> = ({ book, bookCover }) => {
  // Helper function to safely access the first sentence
  const getFirstSentence = (book: GoogleBook & Book) => {
    return book?.first_sentence?.length > 0 ? book.first_sentence[0] : "N/A";
  };
  return (
    <>
      <div className="shadow-md rounded-lg overflow-hidden py-4 md:flex md:space-x-6">
        {bookCover && (
          <div className="w-full md:w-1/3 flex items-center justify-center mx-auto">
            <Image
              src={bookCover}
              alt={book?.volumeInfo?.title || "Book Cover Image"}
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
            <h1 className="text-3xl font-bold ">
              {book && (book?.volumeInfo?.title || book?.title || "N/A")}
            </h1>
            {book?.volumeInfo?.subtitle ? (
              <h1 className="text-xl font-semibold">
                {book.volumeInfo.subtitle || null}
              </h1>
            ) : null}
          </div>
          <p className="text-lg font-semibold">
            Author:{" "}
            {book &&
              (book?.volumeInfo?.authors?.join(", ") ||
                book?.author_name?.join(", ") ||
                "N/A")}
          </p>
          <p className="text-md text-muted-foreground">
            <span className="text-white">Published Date:</span>{" "}
            {book &&
              (book?.volumeInfo?.publishedDate ||
                book?.first_publish_year?.toString() ||
                "N/A")}
          </p>
          <p className="text-md text-muted-foreground">
            <span className="text-white font-normal">Categories:</span>{" "}
            {book &&
              (book?.volumeInfo?.categories?.join(", ") ||
                book?.subject?.slice(0, 3).join(", ") ||
                "N/A")}
          </p>
          <p className="text-md text-muted-foreground">
            <span className="text-white">Description:</span>{" "}
            {book && (book?.volumeInfo?.description || getFirstSentence(book))}
          </p>
        </div>
      </div>
    </>
  );
};

export default BookInfo;
