import { useState } from "react";
import toast from "react-hot-toast";
import { useT } from "../i18n/i18n";

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

export default function PaletteBar({ colors }) {
  const [active, setActive] = useState(null);
  const t = useT();

  const handleCopy = (c) => {
    copy(c.hex);
    toast.success(
      t("swatch.copiedHex", { hex: `\u200E${c.hex.toUpperCase()}\u200E` }),
      {
        icon: (
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 3,
              background: c.hex,
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
        ),
      },
    );
  };

  return (
    <div
      className="anim-scale-in"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {/* ── Main bar ── */}
      <div
        style={{
          display: "flex",
          height: 58,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border)",
          position: "relative",
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            title={c.hex}
            onClick={() => handleCopy(c)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              flex: active === i ? 2.6 : 1,
              background: c.hex,
              transition: "flex 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Shimmer effect */}
            {active === i && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  animation: "shimmer 1.2s ease infinite",
                }}
              />
            )}

            {/* Label — HEX همیشه LTR */}
            <div
              style={{
                opacity: active === i ? 1 : 0,
                transform:
                  active === i
                    ? "translateY(0) scale(1)"
                    : "translateY(4px) scale(0.9)",
                transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
                background: "rgba(0,0,0,0.28)",
                backdropFilter: "blur(6px)",
                borderRadius: 7,
                padding: "4px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.97)",
                  letterSpacing: "0.06em",
                  fontFamily: "monospace",
                  direction: "ltr",
                }}
              >
                {c.hex.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dot indicators ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 2px",
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            title={c.hex}
            onClick={() => handleCopy(c)}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: active === i ? "scale(1.4)" : "scale(1)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 2,
                background: c.hex,
                boxShadow:
                  active === i
                    ? `0 2px 8px ${c.hex}80`
                    : `0 1px 4px ${c.hex}44`,
                transition: "box-shadow 0.18s",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
