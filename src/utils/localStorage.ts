// utils/localStorage.ts

/**
 * Simpan data ke localStorage dengan aman.
 */
export const setLocalStorage = (key: string, value: unknown): void => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Gagal menyimpan ke localStorage: ${key}`, error);
  }
};

/**
 * Ambil data dari localStorage dengan aman (auto-parse JSON jika valid).
 * Generic <T> agar hasil bisa ditentukan tipenya.
 */
export const getLocalStorage = <T = unknown>(
  key: string,
  defaultValue: T | null = null
): T | string | null => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value; // Jika bukan JSON, kembalikan string
    }
  } catch (error) {
    console.error(`Gagal membaca dari localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Hapus data dari localStorage.
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Gagal menghapus localStorage: ${key}`, error);
  }
};

/**
 * Hapus seluruh localStorage.
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Gagal membersihkan localStorage", error);
  }
};