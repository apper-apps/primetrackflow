import React from "react";
import { cn } from "@/utils/cn";

const StatusFilter = ({ activeFilter, onFilterChange, statusCounts }) => {
  const filters = [
    { key: "All", label: "All", count: statusCounts.total },
    { key: "Open", label: "Open", count: statusCounts.open },
    { key: "In Progress", label: "In Progress", count: statusCounts.inProgress },
    { key: "Resolved", label: "Resolved", count: statusCounts.resolved },
    { key: "Closed", label: "Closed", count: statusCounts.closed }
  ];

  return (
    <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-subtle border border-gray-200">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeFilter === filter.key
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-subtle transform scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <span>{filter.label}</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            activeFilter === filter.key
              ? "bg-white/20 text-white"
              : "bg-gray-200 text-gray-600"
          )}>
            {filter.count || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;