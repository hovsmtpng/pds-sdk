/**
 * Generate initials from a name
 * @param name - Full name
 * @returns Initials (first and last letter)
 */
export function getInitials(name?: string): string {
  if (!name) return "";

  const parts = name.trim().split(/\s+/); // pisah berdasarkan spasi

  if (parts.length === 1) {
    return parts[0][0].toUpperCase(); // satu kata → ambil huruf pertama
  }

  const first = parts[0][0].toUpperCase();
  const last = parts[parts.length - 1][0].toUpperCase();
  return first + last;
}