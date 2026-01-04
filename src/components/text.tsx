import { cn } from "@/lib/utils";
import React from "react";

type TextSize = "xss" | "xs" | "sm" | "md" | "lg" | "xl";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: TextSize;
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
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
      : "text-xs";

  return (
    <span className={cn(sizeClass, className)} {...props}>
      {children}
    </span>
  );
};
