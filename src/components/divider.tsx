import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  type?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  type = "solid",
  orientation = "horizontal",
  ...props
}) => {
  const borderStyle = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  }[type];

  return (
    <div
      className={cn(
        "border-gray-200",
        orientation === "horizontal" && `border-t ${borderStyle} w-full`,
        orientation === "vertical" && `border-l ${borderStyle} h-6`,
        className
      )}
      {...props}
    />
  );
};
