"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from shadcn

const AudioPlayerSkeleton: React.FC = () => {
  return (
    <div className="relative p-4 w-full max-w-lg mx-auto bg-glass backdrop-blur-md rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="text-left">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-4 w-24 mt-2 bg-gray-700" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 bg-gray-700 rounded-full" />
          <Skeleton className="h-10 w-10 bg-gray-700 rounded-full" />
          <Skeleton className="h-10 w-10 bg-gray-700 rounded-full" />
        </div>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 mt-4">
        <Skeleton className="h-2.5 w-1/2 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
};

export default AudioPlayerSkeleton;
