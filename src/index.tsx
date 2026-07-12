import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import runMigrations from "~/utils/migration";

import App from "./view/App";
import "./font-overrides.css";

runMigrations();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
