// lib/books.ts
import { cache } from "react";

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  isbn: number[];
  first_sentence: string[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    categories?: string[];
    publisher?: string;
    publishedDate?: string;
    infoLink?: string;
    industryIdentifiers: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export type BooksResponse = {
  books: Book[];
  totalPages: number;
};

export const getBooksByCategory = cache(
  async (
    categories: string[],
    page: number = 1,
    limit: number = 10,
  ): Promise<BooksResponse> => {
    const query = categories
      .map((category) => `subject:"${category}"`)
      .join(" OR ");
    const url = `https://openlibrary.org/search.json?q=${query}&language:eng&page=${page}&limit=${limit}`;

    try {
      const res = await fetch(url, { next: { revalidate: 60 } });

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();
      const books: Book[] = data.docs || [];
      const totalPages = Math.ceil(data.num_found / limit);
      return { books, totalPages };
    } catch (error: unknown) {
      console.log(error);
      throw new Error(`${error}`);
    }
  },
);

export const searchBooks = cache(
  async (
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<BooksResponse> => {
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${limit}&language:eng`,
        {
          next: { revalidate: 60 },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();
      const totalPages = Math.ceil(data.num_found / limit + 1);
      const books: Book[] = data.docs || [];
      return { books, totalPages };
    } catch (error: unknown) {
      console.log(error);
      throw new Error(`${error}`);
    }
  },
);

export function getBookCoverUrl(
  coverId?: number | null,
  isbn?: number | null,
  size: "S" | "M" | "L" = "M",
): { url: string; coverId?: number | null; isbn?: number | null } {
  let url: string = "";
  if (coverId) {
    url = `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
    return { url, coverId };
  } else {
    url = `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
    return { url, isbn };
  }
}

export const getSpecificBook = cache(async (isbn: number) => {
  const google_key = process.env.GOOGLE_API_BOOKS_KEY!;
  const url = `https:www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=en&key=${google_key}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      throw new Error("Failed to fetch specific Book! Retry again");
    }
    const data = await res.json();
    const books: GoogleBook[] = data.items || [];
    return books as GoogleBook[] & Book[];
  } catch (error: unknown) {
    console.log(error);
    throw new Error(`${error}`);
  }
});

export const getSpecificOpenLibrayrBook = cache(
  async (book: string, author: string) => {
    const openLibraryUrl = `https://openlibrary.org/search.json?q=${book.split(" ").join("+")}&author=${author.split(" ").join("+")}&language=eng`;

    const res = await fetch(openLibraryUrl, { next: { revalidate: 30 } });

    if (!res)
      throw new Error(
        "Something went wrong when fetching book from OpenLibrary",
      );
    const data = await res.json();
    const specificBookOpenLibrary: Book = data.docs[0] || null;

    return specificBookOpenLibrary as Book & GoogleBook;
  },
);
