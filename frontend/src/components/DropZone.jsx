import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useT } from "../i18n/i18n";

export default function DropZone({ image, onFile, disabled }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const t = useT();

  const process = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("drop.onlyImage"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("drop.tooLarge"));
      return;
    }
    toast.success(t("drop.uploaded"));
    onFile(file);
  };

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        process(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onClick={() => !image && fileRef.current.click()}
      style={{
        borderRadius: 14,
        border: `1.5px ${image ? "solid" : "dashed"} ${dragging ? "var(--accent)" : "var(--border-2)"}`,
        background: dragging ? "var(--accent-bg)" : "var(--surface)",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: dragging ? "scale(1.015)" : "scale(1)",
        boxShadow: dragging
          ? "0 0 0 4px rgba(200,61,10,0.08), var(--shadow-sm)"
          : "var(--shadow-sm)",
        cursor: image ? "default" : "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {image ? (
        <div className="relative group">
          <img
            src={image}
            alt={t("drop.previewAlt")}
            style={{
              width: "100%",
              height: 170,
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 56,
              background:
                "linear-gradient(to top, rgba(28,25,21,0.65), transparent)",
            }}
          />

          {/* Hover overlay */}
          <div
            className="preview-overlay cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current.click();
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(28,25,21,0.38)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(253,252,248,0.96)",
                borderRadius: 12,
                padding: "9px 18px",
                fontSize: 12,
                fontWeight: 600,
                color: disabled ? "var(--surface)" : "var(--ink-2)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1.5v8M4 6l3-4.5L10 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.5 12.5h11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {t("drop.changeImage")}
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "rgba(28,25,21,0.55)",
              backdropFilter: "blur(6px)",
              borderRadius: 7,
              padding: "3px 10px",
              fontSize: 10,
              color: "rgba(253,252,248,0.9)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#4D9460",
                boxShadow: "0 0 0 2px rgba(77,148,96,0.3)",
              }}
            />
            {t("drop.readyBadge")}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Upload area */}
          <div
            style={{
              padding: "28px 24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: dragging ? "var(--accent-bg)" : "var(--bg-2)",
                border: `1.5px ${dragging ? "dashed" : "solid"} ${dragging ? "var(--accent)" : "var(--border-2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                transition: "all 0.22s ease",
                transform: dragging
                  ? "scale(1.08) rotate(-5deg)"
                  : "scale(1) rotate(0deg)",
                boxShadow: dragging
                  ? "0 4px 20px rgba(200,61,10,0.15)"
                  : "none",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4v12M8 9l4-5 4 5"
                  stroke={dragging ? "var(--accent)" : "var(--ink-3)"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 20h16"
                  stroke={dragging ? "var(--accent-2)" : "var(--ink-4)"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: dragging ? "var(--accent)" : "var(--ink-2)",
                marginBottom: 5,
                transition: "color 0.2s",
              }}
            >
              {dragging ? t("drop.dragging") : t("drop.dragHere")}
            </p>

            {/* "یا کلیک کنید برای انتخاب" / "or click here to select" */}
            <p
              style={{ fontSize: 11.5, color: "var(--ink-4)", marginBottom: 4 }}
            >
              {t("drop.orLabel")}{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                {t("drop.clickToSelect")}
              </span>{" "}
              {t("drop.forSelect")}
            </p>
          </div>

          {/* Format bar */}
          <div
            style={{
              width: "100%",
              borderTop: "1px solid var(--border)",
              padding: "9px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-2)",
            }}
          >
            {["PNG", "JPG", "WEBP", "GIF"].map((f) => (
              <span
                key={f}
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "var(--ink-4)",
                  letterSpacing: "0.07em",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  padding: "2px 7px",
                  borderRadius: 5,
                }}
              >
                {f}
              </span>
            ))}
            <span style={{ fontSize: 10, color: "var(--ink-4)" }}>
              {t("drop.maxSize")}
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => process(e.target.files[0])}
      />
    </div>
  );
}
