import pako from "pako";

export function decodeFlateBase64<T = any>(encoded: string): T {
    if (!encoded) return null as T;

    const binary = atob(encoded);

    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const text = pako.inflateRaw(bytes, { to: "string" });

    return JSON.parse(text) as T;
}
