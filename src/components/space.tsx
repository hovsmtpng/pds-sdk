import React, { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  children?: ReactNode;
}

export const Space: React.FC<SpaceProps> = ({
  direction = "vertical",
  className,
  children,
  ...props
}) => {
  const spacingClass =
    direction === "vertical" ? "flex flex-col" : "flex flex-row";

  return (
    <div className={cn(spacingClass, className)} {...props}>
      {children}
    </div>
  );
};
