/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEY_SSO_PUNINAR: string;
  // tambahkan variabel VITE_ lainnya di sini jika ada
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
