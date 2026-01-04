// utils.ts

/**
 * Convert an array of pipe-separated strings into an array of objects.
 * If field names are provided, they will be used instead of generic field1, field2, etc.
 * Example:
 * convertToArrayOfObject(["1|01|PUJA|PUNINAR JAYA"], ["id","code","short_name","full_name"])
 * → [{ id: "1", code: "01", short_name: "PUJA", full_name: "PUNINAR JAYA" }]
 */
export function convertToArrayOfObject(
    arr?: string[] | null,
    fields?: string[]
): Record<string, string>[] {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }

    return arr.map((item) => {
        if (typeof item !== "string") return {};

        const parts = item.split("|");
        const obj: Record<string, string> = {};

        parts.forEach((value, index) => {
            const key =
                fields && fields[index]
                    ? fields[index]
                    : `field${index + 1}`;
            obj[key] = value?.trim?.() ?? "";
        });

        return obj;
    });
}
