import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./view/App";
import "./font-overrides.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
