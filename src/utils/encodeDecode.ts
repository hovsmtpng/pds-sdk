// utils/encodeDecode.ts
export function encodeData(data: unknown): string {
    try {
        // pastikan semua tipe diubah ke string JSON
        const json = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(json)));
    } catch (error) {
        console.error("Failed to encode data:", error);
        return "";
    }
}

export function decodeData<T = unknown>(encoded: string): T | string | number | null {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(decoded);

        // Kalau hasilnya string atau number biasa, langsung return
        if (typeof parsed === "string" || typeof parsed === "number" || Array.isArray(parsed) || typeof parsed === "object") {
            return parsed as T;
        }

        return decoded; // fallback kalau bukan JSON
    } catch (error) {
        console.error("Failed to decode data:", error);
        return null;
    }
}
