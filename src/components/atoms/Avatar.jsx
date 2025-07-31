import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt, 
  fallback,
  size = "default",
  ...props 
}, ref) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg"
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (src && !imageError) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={handleImageError}
        className={cn(
          "rounded-full object-cover ring-2 ring-white shadow-sm",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-medium ring-2 ring-white shadow-sm",
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;