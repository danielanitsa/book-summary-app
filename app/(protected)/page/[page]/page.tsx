import SharedLayout from "@/components/SharedLayout";
import BookCard from "@/components/book-card";
import { BooksResponse, getBooksByCategory } from "@/lib/book";

const categories: string[] = [
  "business",
  "investing",
  "economics",
  "philosophy",
  "self-improvement",
];

export const revalidate = 30;

export async function generateStaticParams() {
  const params = Array.from({ length: 300 }, (_, i) => ({
    page: (i + 1).toString(),
  }));

  return params.map((page) => {
    return {
      page: page.page,
    };
  });
}

export default async function Page({ params }: { params?: { page: number } }) {
  const currentPage = Number(params?.page) || 1;
  let limit = 10;

  const books: BooksResponse = await getBooksByCategory(
    categories,
    currentPage,
    limit,
  );
  const hasMoreBooks = books.books.length === limit;

  return (
    <SharedLayout currentPage={currentPage} hasMoreBooks={hasMoreBooks}>
      <BookCard books={books.books} />
    </SharedLayout>
  );
}
