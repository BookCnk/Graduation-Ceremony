import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// ตรวจสอบ URL และ redirect ถ้าจำเป็น
const currentPath = window.location.pathname;
if (
  currentPath === "/login" ||
  currentPath === "/" ||
  currentPath === "/number" ||
  currentPath === "/grad-data"
) {
  if (!currentPath.startsWith("/gradkmutt")) {
    const newPath =
      currentPath === "/" ? "/gradkmutt/login" : `/gradkmutt${currentPath}`;
    window.location.replace(newPath);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/gradkmutt">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
