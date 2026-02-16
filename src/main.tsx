// Define Cesium Base URL explicitly before importing Cesium
// @ts-ignore
window.CESIUM_BASE_URL = "/cesium/";

import * as Cesium from "cesium";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Set the Cesium Ion Access Token
const token = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN;
if (token) {
  Cesium.Ion.defaultAccessToken = token;
  console.log("Cesium Ion Token set:", token.substring(0, 4) + "...");
} else {
  console.error("Cesium Ion Token is MISSING in import.meta.env");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
