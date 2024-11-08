import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyPolyfills, defineCustomElements } from "@eon-ui/eon-ui-components/loader";
import "./i18n/i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <App />
);

applyPolyfills().then(() => {
  defineCustomElements();
});
