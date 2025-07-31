import React from "react";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const IssuesTable = ({ issues, users, onIssueClick, className }) => {
  const getStatusVariant = (status) => {
    const variants = {
      "Open": "open",
      "In Progress": "in-progress", 
      "Resolved": "resolved",
      "Closed": "closed",
      "Critical": "critical"
    };
    return variants[status] || "default";
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden", className)}>
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-900">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">Issue</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-1">Updated</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {issues.map((issue) => {
          const assignee = getUserById(issue.assigneeId);
          return (
            <div
              key={issue.Id}
              onClick={() => onIssueClick(issue)}
              className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* ID */}
                <div className="col-span-1">
                  <span className="text-sm font-mono text-gray-600 group-hover:text-primary transition-colors">
                    #{issue.Id}
                  </span>
                </div>

                {/* Issue Title & Description */}
                <div className="col-span-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {issue.description}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge variant={getStatusVariant(issue.status)}>
                    {issue.status}
                  </Badge>
                </div>

                {/* Priority */}
                <div className="col-span-2">
                  <PriorityIndicator priority={issue.priority} showLabel />
                </div>

                {/* Assignee */}
                <div className="col-span-2">
                  {assignee ? (
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={assignee.avatar}
                        alt={assignee.name}
                        fallback={getInitials(assignee.name)}
                        size="default"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {assignee.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500">Unassigned</span>
                    </div>
                  )}
                </div>

                {/* Last Updated */}
                <div className="col-span-1">
                  <span className="text-sm text-gray-600">
                    {format(new Date(issue.updatedAt), "MMM d")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssuesTable;