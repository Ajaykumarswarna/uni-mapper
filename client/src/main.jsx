import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { DataProvider } from "./context/DAta.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <DataProvider>
    <ThemeProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ThemeProvider>
  </DataProvider>
);
