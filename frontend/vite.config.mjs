import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,

    // ── کاهش حجم ──────────────────────────────
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // حذف console.log در production
        drop_debugger: true,
        passes: 2, // دو پاس فشرده‌سازی
      },
      mangle: true, // کوتاه‌کردن نام متغیرها
    },

    // ── chunk بندی بهتر ────────────────────────
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          toast: ["react-hot-toast"],
        },
      },
    },

    // ── هشدار برای فایل‌های بزرگ ───────────────
    chunkSizeWarningLimit: 500,

    // ── حذف source map در production ───────────
    sourcemap: false,
  },
});
