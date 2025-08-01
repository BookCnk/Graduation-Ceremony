import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👉 ให้ @ ชี้ไปยัง src
    },
  },
  server: {
    open: "/login", // 👉 เปิดหน้า login โดยอัตโนมัติ
  },
});
