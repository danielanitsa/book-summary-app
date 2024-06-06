import React from "react";
import { Skeleton } from "./ui/skeleton";

const BookSummarySkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 p-6 md:p-12 bg-primary-foreground rounded-lg shadow-md">
      <Skeleton className="h-[20px] w-3/4 mb-4" />
      <Skeleton className="h-[20px] w-full mb-4" />
      <Skeleton className="h-[20px] w-full mb-4" />
      <Skeleton className="h-[20px] w-2/3 mb-4" />
      <Skeleton className="h-[20px] w-1/2 mb-4" />
    </div>
  );
};

export default BookSummarySkeleton;
