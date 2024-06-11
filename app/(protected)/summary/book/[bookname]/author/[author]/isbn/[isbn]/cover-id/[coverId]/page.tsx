import BookInfo from "@/components/book-info";
import BookSummary from "@/components/book-summary";
import { GoogleBook, getBookCoverUrl, getSpecificBook } from "@/lib/book";

export const revalidate = 30;

export async function generateStaticParams({
  params,
}: {
  params: { bookname: string; author: string; isbn: number; coverId: number };
}) {
  const [books, coverUrl] = await Promise.all([
    getSpecificBook(params.bookname, params.author, params.isbn),
    getBookCoverUrl(params.coverId, null, "L"),
  ]);

  return books.map((book) => {
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
  let book: GoogleBook | undefined = undefined;
  let bookCover: string | undefined = undefined;

  try {
    if (params?.isbn && params?.author && params?.bookname && params.coverId) {
      // Make parallel calls using Promise.all
      const [books, coverUrl] = await Promise.all([
        getSpecificBook(params.bookname, params.author, params.isbn),
        getBookCoverUrl(params.coverId, null, "L"),
      ]);

      console.log(books);
      if (books.length > 0) {
        book = books[0];
        bookCover = coverUrl.url;
        console.log(bookCover);
      }
    }
  } catch (error: unknown) {
    console.error(error);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BookInfo book={book} bookCover={bookCover} />
      <BookSummary
        bookname={params!.bookname}
        author={params!.author}
        isbn={params!.isbn}
        coverId={params!.coverId}
      />
    </div>
  );
}
