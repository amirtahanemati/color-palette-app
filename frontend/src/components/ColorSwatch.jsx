import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "../i18n/i18n";
import { useFormatNum } from "../utils/utils";

function getLum([r, g, b]) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

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

export default function ColorSwatch({ color, index }) {
  const [hovered, setHovered] = useState(false);
  const t = useT();
  const formatNum = useFormatNum();

  const lum = getLum(color.rgb);
  const light = lum > 0.52;
  const txt = light ? "rgba(28,25,21,0.88)" : "rgba(255,255,255,0.95)";
  const sub = light ? "rgba(28,25,21,0.44)" : "rgba(255,255,255,0.52)";
  const brd = light ? "rgba(28,25,21,0.10)" : "rgba(255,255,255,0.16)";

  const copyHex = () => {
    copy(color.hex);
    toast.success(
      t("swatch.copiedHex", { hex: `\u200E${color.hex.toUpperCase()}\u200E` }),
      {
        icon: (
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: color.hex,
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
        ),
      },
    );
  };

  const copyRgb = (e) => {
    e.stopPropagation();
    const rgb = `rgb(${color.rgb.join(", ")})`;
    copy(rgb);
    toast.success(t("swatch.copiedRgb", { rgb: `\u200E${rgb}\u200E` }));
  };

  return (
    <div
      className="anim-swatch-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${index * 55}ms`,
        borderRadius: 16,
        border: `1px solid ${hovered ? "rgba(0,0,0,0.1)" : "var(--border)"}`,
        background: "var(--surface)",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.16), 0 4px 12px ${color.hex}30`
          : "var(--shadow-sm)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "pointer",
      }}
    >
      {/* ── Color block ── */}
      <div
        onClick={copyHex}
        style={{
          height: 112,
          background: color.hex,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Index badge — همیشه عدد فرمت‌شده بر اساس زبان */}
        <div
          style={{
            position: "absolute",
            top: 9,
            right: 9,
            width: 22,
            height: 22,
            borderRadius: 7,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {formatNum(index + 1)}
          </span>
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "0 10px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            backdropFilter: "blur(1px)",
          }}
        >
          {/* HEX pill */}
          <div
            style={{
              width: "100%",
              padding: "5px 10px",
              background: "rgba(0,0,0,0.24)",
              border: `1px solid ${brd}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              direction: "ltr",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke={txt}
                strokeWidth="1.3"
                fill="none"
              />
              <path
                d="M1.5 6.5H1a.5.5 0 01-.5-.5V1A.5.5 0 011 .5h5a.5.5 0 01.5.5v.5"
                stroke={txt}
                strokeWidth="1.3"
              />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: txt,
                letterSpacing: "0.06em",
                fontFamily: "monospace",
              }}
            >
              {color.hex.toUpperCase()}
            </span>
          </div>

          {/* RGB pill */}
          <div
            onClick={copyRgb}
            style={{
              width: "100%",
              padding: "4px 10px",
              background: "rgba(0,0,0,0.14)",
              border: `1px solid ${brd}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              direction: "ltr",
            }}
          >
            <span
              style={{ fontSize: 9.5, color: sub, fontFamily: "monospace" }}
            >
              {color.rgb.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 12px",
          borderTop: "1px solid var(--border)",
          background: hovered ? "var(--surface-2)" : "var(--surface)",
          transition: "background 0.2s",
        }}
      >
        {/* رنگ و HEX — همیشه LTR چون کد رنگه */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            direction: "ltr",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: color.hex,
              border: "1px solid var(--border-2)",
              boxShadow: `0 2px 6px ${color.hex}44`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10.5,
              color: "var(--ink-3)",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            {color.hex.toUpperCase()}
          </span>
        </div>

        <button
          onClick={copyHex}
          style={{
            fontSize: 10.5,
            padding: "3px 9px",
            borderRadius: 6,
            background: hovered ? "var(--ink)" : "var(--bg-2)",
            color: hovered ? "var(--surface)" : "var(--ink-3)",
            border: `1px solid ${hovered ? "var(--ink)" : "var(--border-2)"}`,
            transition: "all 0.18s ease",
            fontFamily: "Dana, sans-serif",
          }}
        >
          {t("swatch.copy")}
        </button>
      </div>
    </div>
  );
}
