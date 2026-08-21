import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AppContext = createContext(null);

/**
 * Detects the OS/browser preferred color scheme
 */
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Reads persisted values from localStorage.
 * Returns null if the key doesn't exist (first launch).
 */
function readStorage(key) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? null : JSON.parse(v);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }) {
  // ── Theme ─────────────────────────────────────────────────────────────────
  // "light" | "dark" | "system"
  const [themeMode, setThemeMode] = useState(
    () => readStorage("themeMode") ?? "system",
  );

  const resolvedTheme = themeMode === "system" ? getSystemTheme() : themeMode;

  // Apply theme to <html> data-theme attribute and CSS vars
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes when mode is "system"
  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.setAttribute("data-theme", getSystemTheme());
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);

  const setTheme = useCallback((mode) => {
    setThemeMode(mode);
    writeStorage("themeMode", mode);
  }, []);

  // ── Language ──────────────────────────────────────────────────────────────
  // "fa" | "en"
  const [language, setLanguageState] = useState(
    () => readStorage("language") ?? "fa",
  );

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    writeStorage("language", lang);
    document.documentElement.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, []);

  // Apply lang/dir on mount
  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      language === "fa" ? "rtl" : "ltr",
    );
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  // ── Onboarding ────────────────────────────────────────────────────────────
  // null means "not yet decided" → show onboarding
  const [onboardingDone, setOnboardingDoneState] = useState(() => {
    return readStorage("onboardingDone") ?? false;
  });

  const completeOnboarding = useCallback(() => {
    setOnboardingDoneState(true);
    writeStorage("onboardingDone", true);
  }, []);

  // Dev helper: expose reset to window
  useEffect(() => {
    window.__resetOnboarding = () => {
      localStorage.removeItem("onboardingDone");
      localStorage.removeItem("themeMode");
      localStorage.removeItem("language");
      window.location.reload();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        setTheme,
        language,
        setLanguage,
        onboardingDone,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
