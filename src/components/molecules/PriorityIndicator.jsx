import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PriorityIndicator = ({ priority, showLabel = false, className }) => {
  const priorityConfig = {
    Critical: {
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: "AlertTriangle",
      label: "Critical"
    },
    High: {
      color: "text-orange-600",
      bgColor: "bg-orange-100", 
      icon: "ArrowUp",
      label: "High"
    },
    Medium: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: "Minus",
      label: "Medium"
    },
    Low: {
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: "ArrowDown",
      label: "Low"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.Low;

  if (showLabel) {
    return (
      <div className={cn(
        "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}>
        <ApperIcon name={config.icon} className="h-3 w-3" />
        <span>{config.label}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-center w-6 h-6 rounded-full",
      config.bgColor,
      className
    )} title={`${config.label} Priority`}>
      <ApperIcon name={config.icon} className={cn("h-3 w-3", config.color)} />
    </div>
  );
};

export default PriorityIndicator;