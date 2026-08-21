import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "../i18n/i18n";
import { useFormatNum } from "../utils/utils";

function copy(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  });
}

export default function ColorTable({ colors }) {
  const [hRow, setHRow] = useState(null);
  const t = useT();
  const formatNum = useFormatNum();

  const doCopy = (text, label) => {
    copy(text);
    toast.success(`\u200E${label}\u200E ${t("swatch.copiedSuffix")}`);
  };

  /* ستون‌های هدر — # و رنگ ثابت، بقیه از i18n */
  const headers = ["#", t("table.colColor"), "HEX", "RGB", ""];

  return (
    <div
      className="anim-fade-up"
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "28px 36px 1fr 1fr 80px",
          padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-3)",
          gap: 10,
          alignItems: "center",
        }}
      >
        {headers.map((h, i) => (
          <span
            key={i}
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              justifySelf: i < 4 ? "center" : "stretch",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* ── Rows ── */}
      {colors.map((color, i) => {
        const rgbStr = `rgb(${color.rgb.join(", ")})`;
        const isH = hRow === i;

        return (
          <div
            key={i}
            onMouseEnter={() => setHRow(i)}
            onMouseLeave={() => setHRow(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 36px 1fr 1fr 80px",
              padding: "12px 20px",
              alignItems: "center",
              gap: 10,
              borderBottom:
                i < colors.length - 1 ? "1px solid var(--border)" : "none",
              background: isH ? "var(--bg-2)" : "transparent",
              transition: "background 0.15s ease",
            }}
          >
            {/* Index */}
            <span
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                fontWeight: 500,
                fontFamily: "Dana",
                justifySelf: "center",
              }}
            >
              {/* شماره ردیف — فرمت بر اساس زبان، padStart با صفر برای FA دو رقم می‌شه */}
              {formatNum(String(i + 1).padStart(2, "0"))}
            </span>

            {/* Swatch */}
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: color.hex,
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: `0 3px 10px ${color.hex}50`,
                transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isH ? "scale(1.18)" : "scale(1)",
                flexShrink: 0,
                justifySelf: "center",
              }}
            />

            {/* HEX */}
            <span
              onClick={() => doCopy(color.hex, color.hex.toUpperCase())}
              title={t("table.clickToCopy")}
              style={{
                fontSize: 11.5,
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                color: isH ? "var(--accent)" : "var(--ink-2)",
                background: isH ? "var(--accent-bg)" : "transparent",
                border: isH
                  ? "1px solid var(--accent-bd)"
                  : "1px solid transparent",
                padding: "3px 9px",
                borderRadius: 7,
                cursor: "pointer",
                transition: "all 0.15s ease",
                width: "fit-content",
                fontWeight: isH ? 600 : 400,
                justifySelf: "center",
                direction: "ltr",
              }}
            >
              {color.hex.toUpperCase()}
            </span>

            {/* RGB */}
            <span
              onClick={() => doCopy(rgbStr, rgbStr)}
              title={t("table.clickToCopy")}
              style={{
                fontSize: 10.5,
                fontFamily: "monospace",
                color: isH ? "var(--ink-2)" : "var(--ink-4)",
                background: isH ? "var(--bg-3)" : "transparent",
                border: isH
                  ? "1px solid var(--border-2)"
                  : "1px solid transparent",
                padding: "3px 9px",
                borderRadius: 7,
                cursor: "pointer",
                transition: "all 0.15s ease",
                width: "fit-content",
                justifySelf: "center",
                direction: "ltr",
              }}
            >
              {color.rgb.join(", ")}
            </span>

            {/* Copy button */}
            <button
              onClick={() => doCopy(color.hex, color.hex.toUpperCase())}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 11px",
                borderRadius: 8,
                fontSize: 11,
                fontFamily: "Dana, sans-serif",
                background: isH ? "var(--ink)" : "var(--bg-2)",
                color: isH ? "var(--surface)" : "var(--ink-3)",
                border: `1px solid ${isH ? "var(--ink)" : "var(--border-2)"}`,
                transition: "all 0.15s ease",
                cursor: "pointer",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M1.5 6.5H1a.5.5 0 01-.5-.5V1A.5.5 0 011 .5h5a.5.5 0 01.5.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              {t("swatch.copy")}
            </button>
          </div>
        );
      })}

      {/* ── Footer count ── */}
      <div
        style={{
          padding: "9px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
          {t("table.extractedCount", { n: formatNum(colors.length) })}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {colors.map((c, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 4,
                borderRadius: 3,
                background: c.hex,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
