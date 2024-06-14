import BookInfo from "@/components/book-info";
import BookSummary from "@/components/book-summary";
import {
  Book,
  GoogleBook,
  getBookCoverUrl,
  getSpecificBook,
  getSpecificOpenLibrayrBook,
} from "@/lib/book";

export const revalidate = 30;

export async function generateStaticParams({
  params,
}: {
  params: { bookname: string; author: string; isbn: number; coverId: number };
}) {
  const [books, coverUrl] = await Promise.all([
    getSpecificBook(params.isbn),
    getBookCoverUrl(params.coverId, null, "L"),
  ]);

  return books.map((book: GoogleBook) => {
    return {
      bookname: book.volumeInfo.title,
      author: book.volumeInfo.authors,
      isbn: book.volumeInfo.industryIdentifiers[0].identifier,
      coverId: coverUrl.coverId,
    };
  });
}

export default async function Page({
  params,
}: {
  params?: {
    bookname: string;
    author: string;
    isbn: number;
    coverId: number;
  };
}) {
  let book: (GoogleBook & Book) | undefined = undefined;
  let bookCover: string | undefined = undefined;

  try {
    if (params?.isbn && params?.author && params?.bookname && params.coverId) {
      // Make parallel calls using Promise.all
      const [books, specificBookOpenLibrary, coverUrl] = await Promise.all([
        getSpecificBook(params.isbn),
        getSpecificOpenLibrayrBook(
          decodeURIComponent(params.bookname),
          decodeURIComponent(params.author),
        ),
        getBookCoverUrl(params.coverId, null, "L"),
      ]);

      console.log(books);
      if (books.length > 0) {
        book = books[0];
        bookCover = coverUrl.url;
        console.log(bookCover);
      } else {
        book = specificBookOpenLibrary;
        bookCover = coverUrl.url;
      }
    }
  } catch (error: unknown) {
    console.error(error);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {book ? (
        <>
          <BookInfo book={book} bookCover={bookCover} />
          <BookSummary
            bookname={params!.bookname}
            author={params!.author}
            isbn={params!.isbn}
            coverId={params!.coverId}
          />
        </>
      ) : (
        <p className="text-center font-bold text-xl text-destructive-foreground">
          No book found.
        </p>
      )}
    </div>
  );
}
