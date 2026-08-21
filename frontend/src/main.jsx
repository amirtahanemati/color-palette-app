import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AppProvider, useApp } from "./context/AppContext";
import App from "./App.jsx";
import "./index.css";

const LocalizedToaster = () => {
  const { language } = useApp();
  const isRtl = language === "fa";

  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: isRtl ? "Dana, sans-serif" : "sans-serif",
          fontSize: "12.5px",
          background: "#1C1915",
          color: "#F6F3EC",
          borderRadius: "12px",
          padding: "11px 16px",
          boxShadow:
            "0 8px 32px rgba(28,25,21,0.28), 0 2px 8px rgba(28,25,21,0.12)",

          direction: isRtl ? "rtl" : "ltr",

          minWidth: "210px",
          border: "1px solid rgba(255,255,255,0.07)",
        },
        success: { iconTheme: { primary: "#4D9460", secondary: "#F6F3EC" } },
        error: { iconTheme: { primary: "#C83D0A", secondary: "#F6F3EC" } },
        loading: {
          iconTheme: {
            primary: "#3D7FA8",
            secondary: "rgba(255,255,255,0.15)",
          },
        },
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <LocalizedToaster />
    </AppProvider>
  </React.StrictMode>,
);
