import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export const formatDate = (
    value?: string | Date | null,
    format = "DD MMM YYYY HH:mm"
): string => {
    if (!value) return "-";

    let sanitized = value;

    if (typeof value === "string" && value.endsWith("Z")) {
        sanitized = value.replace(/Z$/, "");
    }

    const parsed = dayjs(sanitized);

    if (!parsed.isValid()) return "-";

    return parsed.format(format);
};