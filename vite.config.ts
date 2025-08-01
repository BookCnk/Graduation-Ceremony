import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/gradkmutt/", // 👉 ตั้งค่า base path สำหรับ production
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👉 ให้ @ ชี้ไปยัง src
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 5173,
    host: true, // 👉 ให้ access ได้จากภายนอก
  },
  preview: {
    port: 3001,
    host: true,
  },
});
