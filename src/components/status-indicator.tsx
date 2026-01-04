import React from "react"

type StatusIndicatorProps = {
  active?: boolean
  label?: string
  pulse?: boolean
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  active = false,
  label,
  pulse = false,
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <span
        className={`relative w-2 h-2 rounded-full ${
          active ? "bg-green-500" : "bg-red-500"
        } ${pulse ? "animate-pulse-medium" : "animate-pulse-fast"}`}
      ></span>
      <span>{label ?? (active ? "Active" : "In Active")}</span>
    </div>
  )
}

export default StatusIndicator
