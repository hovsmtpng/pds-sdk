import { getLocalStorage } from "./localStorage";

type AnyObject = Record<string, any>;

/**
 * Ambil value dari object berdasarkan path (misal: "a.b.c")
 */
const getByPath = (obj: AnyObject, path: string): any => {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current == null || !(key in current)) return null;
    current = current[key];
  }

  return current;
};

interface AccessNode {
  access?: string[];
}

/**
 * Cek otorisasi akses berdasarkan path dan list akses user.
 */
export const accessCheck = (
  keyPath: string,
  requiredAccess: string | string[]
): boolean => {
  try {
    const list = getLocalStorage<AnyObject[]>("menu-access");
    if (!list) return false;

    // Gabungkan array of object menjadi satu object
    const accessRoot: AnyObject = Object.assign({}, ...list);

    const node = getByPath(accessRoot, keyPath) as AccessNode | null;
    if (!node || !Array.isArray(node.access)) return false;

    const userAccessList = node.access;

    if (Array.isArray(requiredAccess)) {
      return requiredAccess.some((a) => userAccessList.includes(a));
    }

    return userAccessList.includes(requiredAccess);
  } catch (error) {
    console.error("Invalid menu-access format:", error);
    return false;
  }
};
