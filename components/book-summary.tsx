"use client";

// app/page.tsx
import { Suspense, lazy, useState } from "react";
import { PencilRuler } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { ReactTyped } from "react-typed";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import("./audio-player"));
const AudioPlayerSkeleton = dynamic(() => import("./audio-player-skeleton"));
const FormError = dynamic(() => import("./form-error"));
const FormSuccess = dynamic(() => import("./form-success"));
const Markdown = dynamic(() => import("react-markdown"));
const BookSummarySkeleton = lazy(() =>
  import("./book-summary-skeleton").then((module) => ({
    default: module.default,
  })),
);

async function fetchSummary(
  bookname: string,
  author: string,
  isbn: string,
  coverId: string,
) {
  const response = await fetch("/api/generate-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookname, author, isbn, coverId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch summary");
  }

  const data = await response.json();
  return data.summary;
}

async function fetchAudioSummary(summary: string) {
  const response = await fetch("/api/generate-audio-summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ summary }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch audio summary");
  }

  const data = await response.json();
  return data.audioUrl;
}

interface BookSummaryProps {
  bookname: string;
  author: string;
  isbn: number;
  coverId: number;
}

const BookSummary: React.FC<BookSummaryProps> = ({
  bookname,
  author,
  isbn,
  coverId,
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [clicked, setClicked] = useState<boolean>(false);
  const [audioSummaryUrl, setAudioSummaryUrl] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleGenerateSummary = async (
    bookname: string,
    author: string,
    isbn: number,
  ) => {
    setClicked(true);
    startTransition(() => {
      setError("");
      setSuccess("");
      fetchSummary(
        `${encodeURI(bookname)}`,
        `${encodeURI(author)}`,
        isbn.toString(),
        coverId.toString(),
      )
        .then(async (summary) => {
          setSummary(summary);
          try {
            const audioSummary = await fetchAudioSummary(summary);
            setAudioSummaryUrl(audioSummary);
            setSuccess("Audio summary generated successfully.");
            setError(""); // Clear any previous errors
          } catch (audioError) {
            console.error("An error occurred:", audioError);
            setError("An error occurred while generating the audio summary."); // Display a generic error message
          }
        })
        .catch((summaryError) => {
          console.error("An error occurred:", summaryError);
          setError("An error occurred while fetching the summary."); // Display a generic error message
        });
    });
  };

  return (
    <>
      <div className="flex items-center justify-center mx-auto mb-6">
        <Button
          className="w-full md:w-auto flex flex-row-reverse items-center justify-center"
          onClick={() => handleGenerateSummary(bookname, author, isbn)}
          type="button"
          disabled={isPending}
        >
          Generate Detailed Book Summary
          <PencilRuler size={20} className="mr-2" />
        </Button>
      </div>
      {clicked ? (
        <Suspense fallback={<BookSummarySkeleton />}>
          {summary ? (
            <section className="max-h-[500px] mb-4 overflow-scroll bg-primary-foreground p-6 md:p-12 rounded-lg shadow-md">
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
      {clicked ? (
        <Suspense fallback={<AudioPlayerSkeleton />}>
          {audioSummaryUrl ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FormSuccess message={success} />
              <AudioPlayer audioPath={audioSummaryUrl} />
            </div>
          ) : error ? (
            <FormError message={error} />
          ) : (
            <AudioPlayerSkeleton />
          )}
        </Suspense>
      ) : null}
    </>
  );
};

export default BookSummary;
