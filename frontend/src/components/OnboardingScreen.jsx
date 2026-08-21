import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useT } from "../i18n/i18n";

/* ── Palette icon identical to TitleBar ── */
function PaletteIcon({ size = 40 }) {
  const s = size;
  const c = s / 2;
  const r = s * 0.43;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="var(--border-2)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="2.5 3.5"
        strokeLinecap="round"
      />
      <circle cx={c} cy={c * 0.4} r={s * 0.115} fill="#C83D0A" />
      <circle
        cx={c * 1.59}
        cy={c * 1.36}
        r={s * 0.115}
        fill="#3D7FA8"
        opacity="0.9"
      />
      <circle
        cx={c * 0.41}
        cy={c * 1.36}
        r={s * 0.115}
        fill="#4D9460"
        opacity="0.9"
      />
      <circle cx={c} cy={c} r={s * 0.07} fill="var(--ink-3)" opacity="0.35" />
      <line
        x1={c}
        y1={c * 0.63}
        x2={c}
        y2={c * 0.88}
        stroke="var(--ink-4)"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
      />
      <line
        x1={c * 1.43}
        y1={c * 1.22}
        x2={c * 1.12}
        y2={c * 1.09}
        stroke="var(--ink-4)"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
      />
      <line
        x1={c * 0.57}
        y1={c * 1.22}
        x2={c * 0.88}
        y2={c * 1.09}
        stroke="var(--ink-4)"
        strokeWidth="0.9"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

/* ── Sun icon ── */
function SunIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle
        cx="9"
        cy="9"
        r="3.5"
        fill={active ? "#C83D0A" : "currentColor"}
        opacity={active ? 1 : 0.5}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 9 + Math.cos(rad) * 5.2;
        const y1 = 9 + Math.sin(rad) * 5.2;
        const x2 = 9 + Math.cos(rad) * 7;
        const y2 = 9 + Math.sin(rad) * 7;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={active ? "#C83D0A" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={active ? 0.8 : 0.4}
          />
        );
      })}
    </svg>
  );
}

/* ── Moon icon ── */
function MoonIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M14 9.5A5.5 5.5 0 018.5 4a5.5 5.5 0 100 11A5.5 5.5 0 0014 9.5z"
        fill={active ? "#3D7FA8" : "none"}
        stroke={active ? "#3D7FA8" : "currentColor"}
        strokeWidth="1.4"
        opacity={active ? 1 : 0.5}
      />
    </svg>
  );
}

/* ── Monitor icon ── */
function MonitorIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="2"
        width="14"
        height="11"
        rx="2"
        stroke={active ? "var(--accent)" : "currentColor"}
        strokeWidth="1.4"
        fill={active ? "var(--accent-bg)" : "none"}
        opacity={active ? 1 : 0.5}
      />
      <path
        d="M6.5 16h5M9 13v3"
        stroke={active ? "var(--accent)" : "currentColor"}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={active ? 0.8 : 0.4}
      />
      <circle
        cx="9"
        cy="7"
        r="1.8"
        fill={active ? "var(--accent)" : "currentColor"}
        opacity={active ? 0.7 : 0.3}
      />
    </svg>
  );
}

export default function OnboardingScreen({ onDone }) {
  const { themeMode, setTheme, language, setLanguage, resolvedTheme } =
    useApp();
  const t = useT();

  const [localTheme, setLocalTheme] = useState(themeMode);
  const [localLang, setLocalLang] = useState(language);

  const handleThemeSelect = (mode) => {
    setLocalTheme(mode);
    setTheme(mode); // live preview
  };

  const handleLangSelect = (lang) => {
    setLocalLang(lang);
    setLanguage(lang); // live preview
  };

  const handleStart = () => {
    onDone();
  };

  const themeOptions = [
    {
      key: "light",
      icon: <SunIcon active={localTheme === "light"} />,
      label: t("onboarding.themeLight"),
    },
    {
      key: "dark",
      icon: <MoonIcon active={localTheme === "dark"} />,
      label: t("onboarding.themeDark"),
    },
    {
      key: "system",
      icon: <MonitorIcon active={localTheme === "system"} />,
      label: t("onboarding.themeSystem"),
      sub: t("onboarding.themeSystemDesc"),
    },
  ];

  const langOptions = [
    { key: "fa", label: "فارسی", sub: "Persian" },
    { key: "en", label: "English", sub: "انگلیسی" },
  ];

  return (
    <div
      className="anim-fade-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        overflow: "auto",
      }}
    >
      {/* Decorative background orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,61,10,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(61,127,168,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-md)",
              animation: "orbFloat 3s ease-in-out infinite",
            }}
          >
            <PaletteIcon size={44} />
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 6,
                letterSpacing: "-0.01em",
              }}
            >
              {t("onboarding.welcome")} 👋
            </h1>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--ink-3)",
                lineHeight: 1.7,
                maxWidth: 320,
              }}
            >
              {t("onboarding.subtitle")}
            </p>
          </div>
        </div>

        {/* ── Theme Card ── */}
        <OnboardingCard
          title={t("onboarding.themeTitle")}
          desc={t("onboarding.themeDesc")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {themeOptions.map((opt) => (
              <ThemeOption
                key={opt.key}
                active={localTheme === opt.key}
                icon={opt.icon}
                label={opt.label}
                sub={opt.sub}
                onClick={() => handleThemeSelect(opt.key)}
              />
            ))}
          </div>
        </OnboardingCard>

        {/* ── Language Card ── */}
        <OnboardingCard
          title={t("onboarding.langTitle")}
          desc={t("onboarding.langDesc")}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {langOptions.map((opt) => (
              <LangOption
                key={opt.key}
                active={localLang === opt.key}
                label={opt.label}
                sub={opt.sub}
                onClick={() => handleLangSelect(opt.key)}
              />
            ))}
          </div>
        </OnboardingCard>

        {/* ── Footer note ── */}
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "var(--ink-4)",
            lineHeight: 1.6,
          }}
        >
          {t("onboarding.settingsNote")}
        </p>

        {/* ── Start button ── */}
        <StartButton label={t("onboarding.start")} onClick={handleStart} />
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function OnboardingCard({ title, desc, children }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--ink-2)",
            marginBottom: 2,
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: 11, color: "var(--ink-4)" }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function ThemeOption({ active, icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        border: `1.5px solid ${active ? "var(--accent-bd)" : "var(--border)"}`,
        background: active ? "var(--accent-bg)" : "var(--bg-2)",
        cursor: "pointer",
        textAlign: "right",
        transition: "all 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: active ? "scale(1.01)" : "scale(1)",
        color: active ? "var(--accent)" : "var(--ink-3)",
      }}
    >
      {icon}
      <div style={{ flex: 1, textAlign: "start" }}>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: active ? 600 : 500,
            color: active ? "var(--accent)" : "var(--ink-2)",
          }}
        >
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 1 }}>
            {sub}
          </p>
        )}
      </div>
      {active && (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 5,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M1.5 4.5L3.5 6.5L7.5 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

function LangOption({ active, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "14px 10px",
        borderRadius: 10,
        border: `1.5px solid ${active ? "var(--accent-bd)" : "var(--border)"}`,
        background: active ? "var(--accent-bg)" : "var(--bg-2)",
        cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: active ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: active ? "var(--accent)" : "var(--ink-2)",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 10, color: "var(--ink-4)" }}>{sub}</span>
      {active && (
        <div
          style={{
            marginTop: 4,
            width: 20,
            height: 4,
            borderRadius: 3,
            background: "var(--accent)",
            opacity: 0.7,
          }}
        />
      )}
    </button>
  );
}

function StartButton({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "13px 20px",
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "Dana, sans-serif",
        background: hov ? "var(--accent)" : "var(--ink)",
        color: "var(--surface)",
        border: "none",
        cursor: "pointer",
        boxShadow: hov ? "0 8px 28px rgba(200,61,10,0.32)" : "var(--shadow-md)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
