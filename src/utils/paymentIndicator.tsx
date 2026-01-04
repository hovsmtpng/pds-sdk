// utils.tsx
import React from "react";

export const paymentIndicator = (status?: string) => {
  if (!status) return "-";

  const getTextColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "dibayarkan":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "outstanding":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDotColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "dibayarkan":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "outstanding":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${getDotColor(status)}`} />
      <span className={getTextColor(status)}>{status}</span>
    </div>
  );
};