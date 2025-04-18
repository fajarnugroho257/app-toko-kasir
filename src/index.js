import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";
import { QZTrayProvider } from "./components/QZTrayContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/app-kasir">
    <QZTrayProvider>
      <App />
    </QZTrayProvider>
  </BrowserRouter>
);
