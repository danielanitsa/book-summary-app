"use client";

// app/page.tsx
import { Suspense, useState } from "react";
import { PencilRuler } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import BookSummarySkeleton from "./book-summary-skeleton";
import { ReactTyped } from "react-typed";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

async function fetchSummary(bookname: string, author: string, isbn: string) {
  const response = await fetch("/api/generate-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookname, author, isbn }),
  });

  const data = await response.json();
  return data.summary;
}

interface BookSummaryProps {
  bookname: string;
  author: string;
  isbn: number;
}

const BookSummary: React.FC<BookSummaryProps> = ({
  bookname,
  author,
  isbn,
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerateSummary = async (
    bookname: string,
    author: string,
    isbn: number,
  ) => {
    setClicked(true);
    startTransition(async () => {
      const summary = await fetchSummary(
        `${encodeURI(bookname)}`,
        `${encodeURI(author)}`,
        isbn.toString(),
      );

      setSummary(summary);
    });
  };

  return (
    <>
      <div className="flex items-center justify-center mx-auto mb-6">
        <Button
          className="w-full md:w-auto flex flex-row-reverse items-center justify-center"
          onClick={() => handleGenerateSummary(bookname, author, isbn)}
          disabled={isPending}
        >
          Generate Detailed Book Summary
          <PencilRuler size={20} className="mr-2" />
        </Button>
      </div>
      {clicked ? (
        <Suspense fallback={<BookSummarySkeleton />}>
          {summary ? (
            <section className="max-h-[500px] overflow-scroll bg-primary-foreground p-6 md:p-12 rounded-lg shadow-md">
              <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold text-secondary-foreground">
                  Book Summary
                </h2>
                <div className="text-md text-secondary-foreground leading-relaxed max-w-prose">
                  <ReactTyped
                    strings={[summary.replace(/\n/g, "<br/>")]}
                    typeSpeed={5}
                    loop={false}
                    showCursor={true}
                    cursorChar={"|"}
                    onComplete={(self) => {
                      self.destroy();
                      const markdownContent =
                        document.getElementById("markdown-content");
                      if (markdownContent) {
                        markdownContent.classList.remove("hidden");
                      }
                    }}
                  />
                  <div id="markdown-content" className="hidden">
                    <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {summary}
                    </Markdown>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <BookSummarySkeleton />
          )}
        </Suspense>
      ) : null}
    </>
  );
};

export default BookSummary;
