import { cn } from "@/lib/utils";
import React from "react";

type LabelSize = "xss" | "xs" | "sm" | "md" | "lg" | "xl";

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  size = "xss",
  className,
  children,
  ...props
}) => {
  const sizeClass =
    size === "xss"
      ? "text-[10px]"
      : size === "xs"
      ? "text-[12px]"
      : size === "sm"
      ? "text-[14px]"
      : size === "md"
      ? "text-[16px]"
      : size === "lg"
      ? "text-[18px]"
      : size === "xl"
      ? "text-[20px]"
      : `text-[${size}px]`;

  return (
    <label className={cn(sizeClass, className)} {...props}>
      {children}
    </label>
  );
};
