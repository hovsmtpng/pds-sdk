// utils.tsx
import { cn } from "@/lib/utils";

/**
 * Return status indicator berdasarkan status, startDate, dan endDate.
 * PRIORITAS:
 * 1️⃣ Jika ada `status`, gunakan itu (misal "ACTIVE" → hijau, lainnya → merah)
 * 2️⃣ Jika tidak ada `status`, cek apakah sekarang berada di antara `startDate` & `endDate`
 *     → jika ya = hijau (aktif), jika tidak = merah (tidak aktif)
 */
export const statusIndicator = (
  status?: string,
  startDate?: string | Date,
  endDate?: string | Date
) => {
  let isActive = false;
  let label = "";

  if (status) {
    const activeStatuses = ["ACTIVE", "SUCCESS", "COMPLETED", "OK"];
    isActive = activeStatuses.includes(status.toUpperCase());
    label = status;
  } else if (startDate && endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    isActive = now >= start && now <= end;
    label = isActive ? "Active" : "Inactive";
  }

  if (!label) {
    return "-"
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"
          }`}
      />
      <span>{label}</span>
    </div>
  );
};

export const StatusIndicatorV2 = ({
  value,
  className,
  circleClassName,
}: {
  value?: string;
  className?: string;
  circleClassName?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          circleClassName
        )}
      />
      <span>{value}</span>
    </div>
  );
};