import * as React from "react"
import { cn } from "@/lib/utils"

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column"
  children?: React.ReactNode
}

/**
 * Flex component — pembungkus <div> dengan arah flex (row / column)
 */
export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  className,
  children,
  ...props
}) => {
  const directionClass =
    direction === "column" ? "flex flex-col" : "flex flex-row"

  return (
    <div className={cn(directionClass, className)} {...props}>
      {children}
    </div>
  )
}
