import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/translation.json";
import id from "@/locales/id/translation.json";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";

/* =========================
   Types
========================= */

type SupportedLanguage = "en" | "id";

/* =========================
   Init language
========================= */

const language = (getLocalStorage("language") as SupportedLanguage) || "en";

/* =========================
   Resources
========================= */

const resources: Resource = {
   en: { translation: en },
   id: { translation: id },
};

/* =========================
   i18n Init
========================= */

i18n.use(initReactI18next).init({
   resources,
   lng: language,
   fallbackLng: "en",
   interpolation: {
      escapeValue: false,
   },
});

/* =========================
   Persist language change
========================= */

i18n.on("languageChanged", (lng: string) => {
   setLocalStorage("language", lng);
});

export default i18n;