import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import toast from "react-hot-toast";
import TitleBar from "./components/TitleBar.jsx";
import DropZone from "./components/DropZone.jsx";
import PaletteBar from "./components/PaletteBar.jsx";
import ColorSwatch from "./components/ColorSwatch.jsx";
import ColorTable from "./components/ColorTable.jsx";
const OnboardingScreen = lazy(
  () => import("./components/OnboardingScreen.jsx"),
);
import { useApp } from "./context/AppContext";
import { useT } from "./i18n/i18n";
import { useFormatNum } from "./utils/utils.js";

async function getApiUrl() {
  if (window.electronAPI?.getBackendUrl) {
    return await window.electronAPI.getBackendUrl();
  }
  return "http://localhost:8000";
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

/* ── Empty state illustration ── */
function EmptyIllustration() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="48"
        cy="48"
        r="44"
        stroke="var(--border-2)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <circle
        cx="48"
        cy="48"
        r="34"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle
        cx="48"
        cy="48"
        r="18"
        fill="var(--bg-2)"
        stroke="var(--border-2)"
        strokeWidth="1.5"
      />
      <path
        d="M48 38c-5.52 0-10 4.48-10 10 0 2.76 2.24 5 5 5 .83 0 1.59-.2 2.27-.56L48 58c5.52 0 10-4.48 10-10s-4.48-10-10-10z"
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth="1.2"
      />
      <circle cx="43" cy="46" r="1.8" fill="#C83D0A" />
      <circle cx="48" cy="43" r="1.8" fill="#4D9460" />
      <circle cx="53" cy="46" r="1.8" fill="#3D7FA8" />
      <circle cx="51" cy="51" r="1.8" fill="#C83D0A" opacity="0.5" />
      <circle
        cx="43.5"
        cy="53.5"
        r="3"
        fill="var(--surface)"
        stroke="var(--border-2)"
        strokeWidth="1.2"
      />
      <circle cx="48" cy="10" r="4" fill="#C83D0A" opacity="0.85" />
      <circle cx="82" cy="62" r="3.5" fill="#3D7FA8" opacity="0.8" />
      <circle cx="14" cy="62" r="3.5" fill="#4D9460" opacity="0.8" />
      <line
        x1="48"
        y1="14"
        x2="48"
        y2="30"
        stroke="var(--border-2)"
        strokeWidth="0.75"
        strokeDasharray="2 2"
      />
      <line
        x1="79"
        y1="60"
        x2="66"
        y2="54"
        stroke="var(--border-2)"
        strokeWidth="0.75"
        strokeDasharray="2 2"
      />
      <line
        x1="17"
        y1="60"
        x2="30"
        y2="54"
        stroke="var(--border-2)"
        strokeWidth="0.75"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

function StepBadge({ num, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "10px 16px",
        boxShadow: "var(--shadow-sm)",
        minWidth: 130,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          flexShrink: 0,
          background: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{ fontSize: 11, fontWeight: 700, color: "var(--surface)" }}
        >
          {num}
        </span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-2)" }}>
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 10,
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: "var(--ink-4)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function App() {
  const { onboardingDone, completeOnboarding } = useApp();
  const t = useT();
  const formatNum = useFormatNum();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");

  useEffect(() => {
    getApiUrl().then(setApiUrl);
  }, []);

  const handleFile = useCallback((file) => {
    setColors([]);
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }, []);

  const handleExtract = async () => {
    if (!imageFile) return;
    setLoading(true);
    setColors([]);
    const toastId = toast.loading(t("main.analyzingToast"));
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch(`${apiUrl}/extract-colors/`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || t("main.errorGeneric"));
      }
      const data = await res.json();
      setColors(data.colors);
      toast.success(
        t("main.successToast", { n: formatNum(data.colors.length) }),
        {
          id: toastId,
          duration: 3000,
        },
      );
    } catch (err) {
      toast.error(
        err.message.includes("fetch") ? t("main.errorConn") : err.message,
        { id: toastId, duration: 4000 },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageFile(null);
    setColors([]);
    toast(t("main.resetToast"), { icon: "↺" });
  };

  const handleCopyAll = () => {
    copy(colors.map((c) => c.hex).join(", "));
    toast.success(t("main.copyAllToast"));
  };

  return (
    <>
      {!onboardingDone && (
        <Suspense fallback={null}>
          <OnboardingScreen onDone={completeOnboarding} />
        </Suspense>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "var(--bg)",
          overflow: "hidden",
        }}
      >
        <TitleBar />

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* ════════ SIDEBAR ════════ */}
          <aside
            style={{
              width: "var(--sidebar-w)",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              background: "var(--surface)",
              borderInlineEnd: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {/* ── Brand / Header ── */}
            <div
              style={{
                padding: "22px 20px 18px",
                borderBottom: "1px solid var(--border)",
                background:
                  "linear-gradient(160deg, var(--surface) 0%, var(--bg-2) 100%)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  insetInlineStart: 18,
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {[
                  { c: "#C83D0A", d: "0s" },
                  { c: "#3D7FA8", d: "0.55s" },
                  { c: "#4D9460", d: "1.1s" },
                ].map((o, i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      borderRadius: "50%",
                      width: 7,
                      height: 7,
                      background: o.c,
                      boxShadow: `0 0 8px ${o.c}88`,
                      animation: `orbFloat 3.5s ease-in-out infinite ${o.d}`,
                    }}
                  />
                ))}
              </div>
              <div style={{ marginTop: 6 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--ink-4)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {t("sidebar.appSub")}
                </p>
                <h1
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1.25,
                  }}
                >
                  {t("sidebar.heroLine1")}
                  <br />
                  <span style={{ color: "var(--accent)" }}>
                    {t("sidebar.heroLine2")}
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: 11.5,
                    color: "var(--ink-4)",
                    marginTop: 6,
                    lineHeight: 1.7,
                  }}
                >
                  {t("sidebar.heroDesc")}
                </p>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 0" }}>
              <div style={{ marginBottom: 16 }}>
                <SectionLabel
                  icon={
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1.5v7M3 5.5l3-4 3 4M1 10.5h10"
                        stroke="var(--ink-4)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  text={t("sidebar.imageSection")}
                />
                <DropZone image={image} onFile={handleFile} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <ExtractButton
                  onClick={handleExtract}
                  disabled={!imageFile || loading}
                  loading={loading}
                  label={t("sidebar.extractBtn")}
                  loadingLabel={t("sidebar.processing")}
                />
                {(image || colors.length > 0) && (
                  <ResetButton
                    onClick={handleReset}
                    label={t("sidebar.resetBtn")}
                  />
                )}
              </div>

              {colors.length > 0 && (
                <div
                  className="anim-scale-in"
                  style={{
                    borderRadius: 12,
                    padding: "12px 14px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--ink-3)",
                      }}
                    >
                      {t("main.colorsExtractedCount", {
                        n: formatNum(colors.length),
                      })}
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        color: "#4D9460",
                        fontWeight: 700,
                        background: "rgba(77,148,96,0.1)",
                        border: "1px solid rgba(77,148,96,0.2)",
                        padding: "2px 9px",
                        borderRadius: 20,
                      }}
                    >
                      ✓ {t("main.successBadge")}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      alignItems: "stretch",
                      height: 18,
                    }}
                  >
                    {colors.map((c, i) => (
                      <div
                        key={i}
                        title={c.hex}
                        onClick={() => {
                          copy(c.hex);
                          toast.success(
                            t("swatch.copiedHex", {
                              hex: `\u200E${c.hex.toUpperCase()}\u200E`,
                            }),
                          );
                        }}
                        style={{
                          flex: 1,
                          borderRadius: 5,
                          background: c.hex,
                          boxShadow: `0 2px 6px ${c.hex}44`,
                          border: "1px solid rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          transition: "transform 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scaleY(1.2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scaleY(1)")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div
              style={{
                flexShrink: 0,
                padding: "12px 18px",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--ink-4)" }}>
                {t("titlebar.appName")}
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  color: "var(--ink-4)",
                  background: "var(--surface)",
                  border: "1px solid var(--border-2)",
                  padding: "1px 7px",
                  borderRadius: 4,
                }}
              >
                v 1.3
              </span>
            </div>
          </aside>

          {/* ════════ MAIN AREA ════════ */}
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px",
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {colors.length === 0 ? (
              /* ── Empty state ── */
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  paddingBottom: 40,
                }}
              >
                <EmptyIllustration />
                <div style={{ textAlign: "center" }}>
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--ink-2)",
                      marginBottom: 7,
                    }}
                  >
                    {t("main.emptyTitle")}
                  </h2>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: "var(--ink-4)",
                      lineHeight: 1.7,
                      maxWidth: 300,
                    }}
                  >
                    {t("main.emptyDesc")}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <StepBadge num={formatNum(1)} label={t("sidebar.step1")} />
                  <StepBadge num={formatNum(2)} label={t("sidebar.step2")} />
                  <StepBadge num={formatNum(3)} label={t("sidebar.step3")} />
                </div>
              </div>
            ) : (
              /* ── Results ── */
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--ink-2)",
                        marginBottom: 2,
                      }}
                    >
                      {t("main.resultsTitle")}
                    </h2>
                    <p style={{ fontSize: 11, color: "var(--ink-4)" }}>
                      {t("main.dominantColorsFound", {
                        n: formatNum(colors.length),
                      })}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyAll}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: "Dana, sans-serif",
                      background: "var(--surface)",
                      color: "var(--ink-2)",
                      border: "1px solid var(--border-2)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--ink)";
                      e.currentTarget.style.color = "var(--surface)";
                      e.currentTarget.style.borderColor = "var(--ink)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface)";
                      e.currentTarget.style.color = "var(--ink-2)";
                      e.currentTarget.style.borderColor = "var(--border-2)";
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <rect
                        x="3.5"
                        y="3.5"
                        width="9"
                        height="9"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        fill="none"
                      />
                      <path
                        d="M2.5 9H2a1.5 1.5 0 01-1.5-1.5V2A1.5 1.5 0 012 .5h5.5A1.5 1.5 0 019 2v.5"
                        stroke="currentColor"
                        strokeWidth="1.25"
                      />
                    </svg>
                    {t("main.copyAll")}
                  </button>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    borderRadius: 1,
                  }}
                />

                <div>
                  <SectionLabel
                    icon={
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="10"
                          height="4"
                          rx="2"
                          fill="var(--ink-4)"
                        />
                      </svg>
                    }
                    text={t("main.paletteBar")}
                  />
                  <PaletteBar colors={colors} />
                </div>

                <div>
                  <SectionLabel
                    icon={
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="4.5"
                          height="4.5"
                          rx="1.2"
                          fill="var(--ink-4)"
                        />
                        <rect
                          x="6.5"
                          y="1"
                          width="4.5"
                          height="4.5"
                          rx="1.2"
                          fill="var(--ink-4)"
                          opacity="0.6"
                        />
                        <rect
                          x="1"
                          y="6.5"
                          width="4.5"
                          height="4.5"
                          rx="1.2"
                          fill="var(--ink-4)"
                          opacity="0.6"
                        />
                        <rect
                          x="6.5"
                          y="6.5"
                          width="4.5"
                          height="4.5"
                          rx="1.2"
                          fill="var(--ink-4)"
                          opacity="0.35"
                        />
                      </svg>
                    }
                    text={t("main.colorCards")}
                  />
                  <div
                    style={{
                      display: "grid",
                      gap: 12,
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(130px, 1fr))",
                    }}
                  >
                    {colors.map((c, i) => (
                      <ColorSwatch key={i} color={c} index={i} />
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel
                    icon={
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="10"
                          height="10"
                          rx="2"
                          stroke="var(--ink-4)"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <line
                          x1="1"
                          y1="4.5"
                          x2="11"
                          y2="4.5"
                          stroke="var(--ink-4)"
                          strokeWidth="0.8"
                        />
                        <line
                          x1="1"
                          y1="7.5"
                          x2="11"
                          y2="7.5"
                          stroke="var(--ink-4)"
                          strokeWidth="0.8"
                        />
                      </svg>
                    }
                    text={t("main.colorTable")}
                  />
                  <ColorTable colors={colors} />
                </div>

                <div style={{ height: 4 }} />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

/* ── Extract button ── */
function ExtractButton({ onClick, disabled, loading, label, loadingLabel }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 600,
        fontFamily: "Dana, sans-serif",
        background: disabled
          ? "var(--bg-3)"
          : hov
            ? "var(--accent)"
            : "var(--ink)",
        color: disabled ? "var(--ink-4)" : "var(--surface)",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled
          ? "none"
          : hov
            ? "0 8px 24px rgba(200,61,10,0.32)"
            : "var(--shadow-md)",
        transform: hov && !disabled ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        border: "none",
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.22)",
              borderTopColor: "rgba(255,255,255,0.9)",
              animation: "spin 0.8s linear infinite",
              display: "block",
              flexShrink: 0,
            }}
          />
          {loadingLabel}
        </>
      ) : (
        <>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="3" fill="currentColor" opacity="0.4" />
            <circle cx="3" cy="5" r="2.4" fill="currentColor" />
            <circle cx="14" cy="5" r="2.4" fill="currentColor" opacity="0.65" />
            <circle
              cx="8.5"
              cy="14"
              r="2.4"
              fill="currentColor"
              opacity="0.85"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ── Reset button ── */
function ResetButton({ onClick, label }) {
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
        justifyContent: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 10,
        fontSize: 12,
        fontFamily: "Dana, sans-serif",
        background: hov ? "var(--bg-3)" : "transparent",
        color: hov ? "var(--ink-2)" : "var(--ink-3)",
        border: `1px solid ${hov ? "var(--border-2)" : "var(--border)"}`,
        transition: "all 0.18s ease",
        cursor: "pointer",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M2 6.5A4.5 4.5 0 0110.5 3.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M9 1.5l1.5 2-2 1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 6.5A4.5 4.5 0 012.5 9.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M4 11.5l-1.5-2 2-1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
