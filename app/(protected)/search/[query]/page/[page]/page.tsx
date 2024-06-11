import SharedLayout from "@/components/SharedLayout";
import BookCard from "@/components/book-card";
import { BooksResponse, searchBooks } from "@/lib/book";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params?: { query: string; page: number };
}) {
  const query = decodeURI(params?.query || "");

  const currentPage = Number(params?.page) || 1;
  let limit = 10;

  const books: BooksResponse = await searchBooks(query, currentPage, limit);
  const hasMoreBooks = books.books.length === limit; // Check if there are more books to fetch

  return (
    <SharedLayout
      currentPage={currentPage}
      query={query}
      hasMoreBooks={hasMoreBooks}
    >
      <BookCard books={books.books} />
    </SharedLayout>
  );
}
