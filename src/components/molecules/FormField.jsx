import React from "react";
import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  children, 
  error, 
  required = false, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label className={cn(
          "block text-sm font-medium text-gray-900",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;