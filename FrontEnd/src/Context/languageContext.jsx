import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("hg_lang") || "en"
  );

  const toggleLang = () => {
    setLang((prev) => {
      const cycle = { en: "vi", vi: "cn", cn: "fr", fr: "en" };
      const next = cycle[prev] ?? "en";
      localStorage.setItem("hg_lang", next);
      return next;
    });
  };

  const changeLang = (code) => {
    if (!["en", "vi", "cn", "fr"].includes(code)) return;
    setLang(code);
    localStorage.setItem("hg_lang", code);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
