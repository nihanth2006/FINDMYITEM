import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ItemsProvider } from "./context/ItemsContext";
import "./styles.css"; // if needed

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ItemsProvider>
    <App />
  </ItemsProvider>
);
