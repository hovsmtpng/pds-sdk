import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { getLocalStorage } from "./localStorage";

const KEY_SSO_PUNINAR = import.meta.env.VITE_KEY_SSO_PUNINAR as string;


export function generateHeaders(): Record<string, string> {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 19).replace("T", " "); // 2025-10-02 12:34:56
  const encryptionKey = `${KEY_SSO_PUNINAR}${timestamp}`;
  const keyPun = SHA256(encryptionKey).toString(Hex);

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getLocalStorage("odong-token")}`,
    "key-puninar": keyPun,
    timestamp,
  };
}