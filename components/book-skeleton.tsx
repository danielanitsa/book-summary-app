import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const BookSkeleton = () => {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index} className="flex flex-col w-[350px] md:w-[450px]">
          <CardHeader className="p-4">
            <div className="relative w-full h-64 mb-4">
              <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg" />
            </div>
            <Skeleton className="h-6 mb-2 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="p-4">
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default BookSkeleton;
