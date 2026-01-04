import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";

const KEY_SSO_PUNINAR = "SYd3VPunSS0#@!" as string;


export function generateHeaders(): Record<string, string> {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 19).replace("T", " "); // 2025-10-02 12:34:56
  const encryptionKey = `${KEY_SSO_PUNINAR}${timestamp}`;
  const keyPun = SHA256(encryptionKey).toString(Hex);

  return {
    "Content-Type": "application/json",
    "key-puninar": keyPun,
    timestamp,
  };
}