// filen starter React app og connects den til HTML

// Import React's StrictMode for at finde fejl i koden
import { StrictMode } from "react"

// Import createRoot til at render vores app
// createRoot er en nyere måde at starte React apps på
import { createRoot } from "react-dom/client"

// Import BrowserRouter til at håndtere navigation mellem sider
import { BrowserRouter } from "react-router-dom"

// Import main CSS file for global styling
import "./css/index.css"

// Import main App component
import App from "./App.jsx"

// Find the HTML element with id="root" and create a React root
// This connects our React app to the HTML page
createRoot(document.getElementById("root")).render(
  // StrictMode helps us write better code by showing warnings
  <StrictMode>
    {/* BrowserRouter enables routing (navigation between pages) */}
    <BrowserRouter>
      {/* Our main App component - this starts everything */}
      <App />
    </BrowserRouter>
  </StrictMode>
);