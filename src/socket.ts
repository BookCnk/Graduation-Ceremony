// frontend/src/socket.ts
import { io } from "socket.io-client";
const SOCKET_URL = "http://10.2.15.114:3002";
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";
console.log(SOCKET_URL);


const socket = io(SOCKET_URL, {
  transports: ["websocket"], // ไม่ใช้ polling
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", () => {
  console.warn("❌ Disconnected from Socket.IO server");
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Connection error:", err.message);
});

export default socket;
