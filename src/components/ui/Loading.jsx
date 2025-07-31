import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-48 rounded-md"></div>
        <div className="skeleton h-10 w-32 rounded-md"></div>
      </div>
      
      {/* Filter tabs skeleton */}
      <div className="flex space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-md"></div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow-subtle border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1">
              <div className="skeleton h-4 w-8 rounded"></div>
            </div>
            <div className="col-span-4">
              <div className="skeleton h-4 w-16 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="skeleton h-4 w-12 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="skeleton h-4 w-14 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="skeleton h-4 w-16 rounded"></div>
            </div>
            <div className="col-span-1">
              <div className="skeleton h-4 w-20 rounded"></div>
            </div>
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="border-b border-gray-100 p-4 last:border-b-0">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                <div className="skeleton h-4 w-8 rounded"></div>
              </div>
              <div className="col-span-4">
                <div className="skeleton h-5 w-full rounded mb-1"></div>
                <div className="skeleton h-3 w-3/4 rounded"></div>
              </div>
              <div className="col-span-2">
                <div className="skeleton h-6 w-16 rounded-full"></div>
              </div>
              <div className="col-span-2">
                <div className="skeleton h-6 w-6 rounded-full"></div>
              </div>
              <div className="col-span-2">
                <div className="skeleton h-8 w-8 rounded-full"></div>
              </div>
              <div className="col-span-1">
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;