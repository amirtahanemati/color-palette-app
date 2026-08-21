import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useT } from "../i18n/i18n";
import bannerImg from "../assets/banner.jpg";

/* ── Brand palette icon ── */
function PaletteIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11"
        cy="11"
        r="9.5"
        stroke="var(--ink-3)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2 3"
        strokeLinecap="round"
      />
      <circle cx="11" cy="4.5" r="2.5" fill="#C83D0A" />
      <circle cx="17.5" cy="14.5" r="2.5" fill="#3D7FA8" opacity="0.9" />
      <circle cx="4.5" cy="14.5" r="2.5" fill="#4D9460" opacity="0.9" />
      <circle cx="11" cy="11" r="1.5" fill="var(--ink-3)" opacity="0.3" />
      <line
        x1="11"
        y1="6.5"
        x2="11"
        y2="9.5"
        stroke="var(--ink-4)"
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
      />
      <line
        x1="15.7"
        y1="13.2"
        x2="12.3"
        y2="11.8"
        stroke="var(--ink-4)"
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
      />
      <line
        x1="6.3"
        y1="13.2"
        x2="9.7"
        y2="11.8"
        stroke="var(--ink-4)"
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
      />
    </svg>
  );
}

/* ── Theme icons ── */
function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.4" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={6.5 + Math.cos(rad) * 3.7}
            y1={6.5 + Math.sin(rad) * 3.7}
            x2={6.5 + Math.cos(rad) * 5}
            y2={6.5 + Math.sin(rad) * 5}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M10.5 7A4 4 0 016.5 3 4 4 0 100 11a4 4 0 004.5-4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect
        x="1"
        y="1"
        width="11"
        height="8"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M4.5 11.5h4M6.5 9v2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle
        cx="6.5"
        cy="6.5"
        r="5.2"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="6.5"
        cy="6.5"
        rx="2.2"
        ry="5.2"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <line
        x1="1.3"
        y1="6.5"
        x2="11.7"
        y2="6.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2.5 3.5L5 6L7.5 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   Shared dropdown primitives
══════════════════════════════════════════════════ */
function Dropdown({ children }) {
  return (
    <div
      className="anim-scale-in"
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        /* ستون همیشه از سمت راست خودش باز میشه — بدون توجه به RTL/LTR */
        right: 0,
        background: "var(--surface)",
        border: "1px solid var(--border-2)",
        borderRadius: 11,
        boxShadow: "var(--shadow-lg)",
        padding: "4px",
        minWidth: 148,
        zIndex: 400,
      }}
    >
      {children}
    </div>
  );
}

function DropItem({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 7,
        border: "none",
        background: active
          ? "var(--accent-bg)"
          : hov
            ? "var(--bg-2)"
            : "transparent",
        color: active ? "var(--accent)" : "var(--ink-2)",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        fontFamily: "Dana, sans-serif",
        cursor: "pointer",
        transition: "all 0.12s ease",
        /* همیشه چپ‌چین داخل dropdown — محتوا ثابته */
        direction: "ltr",
        textAlign: "left",
        whiteSpace: "nowrap",
      }}
    >
      {icon && (
        <span
          style={{
            color: active ? "var(--accent)" : "var(--ink-3)",
            flexShrink: 0,
            lineHeight: 0,
          }}
        >
          {icon}
        </span>
      )}
      {label}
      {active && (
        <span style={{ marginLeft: "auto", lineHeight: 0 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5L8 2.5"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

/* ── TextIconButton — دکمه‌ی ترکیب آیکون + متن با dropdown ── */
function TextIconButton({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "0 9px",
        height: 28,
        borderRadius: 8,
        border: `1px solid ${hov || active ? "var(--border-2)" : "var(--border)"}`,
        background: active
          ? "var(--bg-3)"
          : hov
            ? "var(--bg-2)"
            : "transparent",
        color: active ? "var(--ink-2)" : hov ? "var(--ink-2)" : "var(--ink-3)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        /* همیشه LTR — آیکون سمت چپ، متن سمت راست، chevron آخر */
        direction: "ltr",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span style={{ lineHeight: 0, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.01em" }}>
        {label}
      </span>
      <span style={{ lineHeight: 0, opacity: 0.6, flexShrink: 0 }}>
        <ChevronIcon />
      </span>
    </button>
  );
}

/* ══════════════════════════════════════════════════
   ThemeToggle
══════════════════════════════════════════════════ */
function ThemeToggle() {
  const { themeMode, setTheme } = useApp();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const currentIcon =
    themeMode === "light" ? (
      <SunIcon />
    ) : themeMode === "dark" ? (
      <MoonIcon />
    ) : (
      <MonitorIcon />
    );
  const currentLabel = t(
    `titlebar.theme${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}`,
  );

  const options = [
    { key: "light", icon: <SunIcon />, label: t("titlebar.themeLight") },
    { key: "dark", icon: <MoonIcon />, label: t("titlebar.themeDark") },
    { key: "system", icon: <MonitorIcon />, label: t("titlebar.themeSystem") },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <TextIconButton
        icon={currentIcon}
        label={currentLabel}
        active={open}
        onClick={() => setOpen((p) => !p)}
      />
      {open && (
        <Dropdown>
          {options.map((o) => (
            <DropItem
              key={o.key}
              icon={o.icon}
              label={o.label}
              active={themeMode === o.key}
              onClick={() => {
                setTheme(o.key);
                setOpen(false);
              }}
            />
          ))}
        </Dropdown>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LangToggle
══════════════════════════════════════════════════ */
function LangToggle() {
  const { language, setLanguage } = useApp();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const currentLabel =
    language === "fa" ? t("titlebar.langFa") : t("titlebar.langEn");

  const options = [
    { key: "fa", label: t("titlebar.langFa") },
    { key: "en", label: t("titlebar.langEn") },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <TextIconButton
        icon={<GlobeIcon />}
        label={currentLabel}
        active={open}
        onClick={() => setOpen((p) => !p)}
      />
      {open && (
        <Dropdown>
          {options.map((o) => (
            <DropItem
              key={o.key}
              label={o.label}
              active={language === o.key}
              onClick={() => {
                setLanguage(o.key);
                setOpen(false);
              }}
            />
          ))}
        </Dropdown>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   WinBtn — دکمه‌های کنترل پنجره
══════════════════════════════════════════════════ */
function WinBtn({ onClick, title, kind, children }) {
  const [h, setH] = useState(false);
  const styles = {
    close: { bg: "#FEE2E2", color: "#B91C1C", border: "#FCA5A5" },
    max: { bg: "#DCFCE7", color: "#15803D", border: "#86EFAC" },
    min: {
      bg: "var(--bg-3)",
      color: "var(--ink-2)",
      border: "var(--border-2)",
    },
  };
  const s = styles[kind] ?? styles.min;
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1px solid ${h ? s.border : "var(--border)"}`,
        background: h ? s.bg : "transparent",
        color: h ? s.color : "var(--ink-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════
   SupportModal — مودال حمایت مالی
══════════════════════════════════════════════════ */
function SupportModal({ onClose }) {
  const t = useT();
  const [hov, setHov] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const { language } = useApp();

  // بستن با Escape
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeInOverlay { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUpModal  { from { opacity:0; transform:translateY(18px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes shimmer {
          0%   { background-position: -400px 0 }
          100% { background-position:  400px 0 }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: 18,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px var(--border)",
          width: "100%",
          maxWidth: 480,
          overflow: "hidden",
          animation: "slideUpModal 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          direction: language === "fa" ? "rtl" : "ltr",
          fontFamily: "Dana, sans-serif",
        }}
      >
        {/* ── بنر ── */}
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          <img
            src={bannerImg}
            alt={t("support.authorName")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          {/* گرادیان روی بنر */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          {/* دکمه بستن */}
          <button
            onClick={onClose}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.25)",
              background: hov ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line
                x1="1.5"
                y1="1.5"
                x2="8.5"
                y2="8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="8.5"
                y1="1.5"
                x2="1.5"
                y2="8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* اسم روی بنر */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              [language === "fa" ? "right" : "left"]: 20,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              {t("support.authorName")}
            </div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.85,
                marginTop: 3,
                fontWeight: 400,
              }}
            >
              {t("support.authorRole")}
            </div>
          </div>
        </div>

        {/* ── محتوا ── */}
        <div style={{ padding: "22px 24px 24px" }}>
          {/* تگ‌های معرفی */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {[t("support.tag1"), t("support.tag2")].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  border: "1px solid var(--border-2)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* توضیحات اصلی */}
          <div
            style={{
              fontSize: 13,
              color: "var(--ink-2)",
              lineHeight: 2,
              marginBottom: 18,
            }}
          >
            {t("support.descPart1")}{" "}
            <strong style={{ color: "var(--ink-1)" }}>
              {t("support.authorName")}
            </strong>{" "}
            {t("support.descPart2")}
          </div>

          {/* دلایل حمایت */}
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[
              { icon: "⚡", text: t("support.reason1") },
              { icon: "🌱", text: t("support.reason2") },
              { icon: "🙌", text: t("support.reason3") },
              { icon: "🎯", text: t("support.reason4") },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <span style={{ fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>
                  {icon}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--ink-2)",
              lineHeight: 2,
              marginBottom: 6,
            }}
          >
            <strong style={{ color: "var(--ink-1)" }}>
              {t("support.noteLabel")}
            </strong>{" "}
            {t("support.noteText")}
          </div>

          {/* دکمه دونیت */}
          <a
            href="https://daramet.com/Tahanemati"
            onClick={(e) => {
              e.preventDefault();
              window.electronAPI?.openExternal(
                "https://daramet.com/Tahanemati",
              );
            }}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: btnHov
                ? "linear-gradient(135deg, #e8892a 0%, #d4701e 100%)"
                : "linear-gradient(135deg, #f5a623 0%, #e8892a 100%)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "Dana, sans-serif",
              cursor: "pointer",
              textDecoration: "none",
              boxShadow: btnHov
                ? "0 6px 20px rgba(245,166,35,0.45)"
                : "0 4px 14px rgba(245,166,35,0.3)",
              transform: btnHov ? "translateY(-1px)" : "translateY(0)",
              transition: "all 0.2s ease",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ opacity: 0.85 }}
            >
              <path
                d="M2.5 7h9M7.5 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("support.donateBtnLabel")}
          </a>

          <p
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "var(--ink-4)",
              marginTop: 10,
              marginBottom: 0,
            }}
          >
            {t("support.footnote")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── SupportButton — دکمه حمایت مالی ── */
function SupportButton() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "0 10px",
          height: 28,
          borderRadius: 8,
          border: `1px solid ${hov ? "#f5a62388" : "var(--border)"}`,
          background: hov ? "rgba(245,166,35,0.1)" : "transparent",
          color: hov ? "#e8892a" : "var(--ink-3)",
          cursor: "pointer",
          transition: "all 0.15s ease",
          direction: "rtl",
          whiteSpace: "nowrap",
          flexShrink: 0,
          fontFamily: "Dana, sans-serif",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 0 }}>☕</span>
        {t("support.btnLabel")}
      </button>

      {open && <SupportModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const t = useT();

  useEffect(() => {
    window.electronAPI?.isMaximized().then(setIsMaximized);
  }, []);

  return (
    <div
      style={{
        height: "var(--titlebar-h)",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 14px",
        zIndex: 200,
        position: "relative",
        flexShrink: 0,
        direction: "ltr",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* ── drag region (پشت همه چیز) ── */}
      <div
        style={{ position: "absolute", inset: 0, WebkitAppRegion: "drag" }}
      />

      {/* ══ سمت چپ: Logo + divider + ThemeToggle + LangToggle ══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          position: "relative",
          zIndex: 1,
          WebkitAppRegion: "no-drag",
        }}
      >
        {/* Logo block */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "var(--bg-2)",
              border: "1px solid var(--border-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PaletteIcon />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--ink-2)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {t("titlebar.appName")}
            </span>
            <span
              style={{
                fontSize: 9,
                color: "var(--ink-4)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {t("titlebar.appSub")}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 18,
            background: "var(--border-2)",
            flexShrink: 0,
          }}
        />

        {/* دکمه‌های Theme، Lang و Support */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <ThemeToggle />
          <LangToggle />
          <SupportButton />
        </div>
      </div>

      {/* ══ سمت راست: WinBtns ══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          position: "relative",
          zIndex: 1,
          WebkitAppRegion: "no-drag",
        }}
      >
        <WinBtn
          onClick={() => window.electronAPI?.minimizeWindow()}
          title={t("titlebar.minimize")}
          kind="min"
        >
          <svg width="10" height="2" viewBox="0 0 10 2">
            <rect width="10" height="2" rx="1" fill="currentColor" />
          </svg>
        </WinBtn>

        <WinBtn
          onClick={() => {
            window.electronAPI?.maximizeWindow();
            setIsMaximized((p) => !p);
          }}
          title={isMaximized ? t("titlebar.restore") : t("titlebar.maximize")}
          kind="max"
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M3 1H9V7H7M1 3H7V9H1V3Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect
                x="1"
                y="1"
                width="8"
                height="8"
                stroke="currentColor"
                strokeWidth="1.1"
              />
            </svg>
          )}
        </WinBtn>

        <WinBtn
          onClick={() => window.electronAPI?.closeWindow()}
          title={t("titlebar.close")}
          kind="close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line
              x1="1.5"
              y1="1.5"
              x2="8.5"
              y2="8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="8.5"
              y1="1.5"
              x2="1.5"
              y2="8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </WinBtn>
      </div>
    </div>
  );
}
