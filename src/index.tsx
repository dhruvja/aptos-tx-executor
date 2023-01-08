import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "semantic-ui-css/semantic.min.css"

declare global {
  interface Window {
    aptos: any;
    martian: any;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

window.addEventListener("load", () => {
  
  root.render(
      <App />
  );
});
