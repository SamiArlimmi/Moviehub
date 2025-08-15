// Importer React's StrictMode til at finde fejl i koden
import { StrictMode } from "react"

// Importer createRoot til at render vores app
// createRoot er en nyere måde at starte React apps på
import { createRoot } from "react-dom/client"

// Importer BrowserRouter til at håndtere navigation mellem sider
import { BrowserRouter } from "react-router-dom"

// Importer hoved CSS fil til global styling
import "./css/index.css"

// Importer hoved App komponent
import App from "./App.jsx"

// Find HTML elementet med id="root" og skab en React root
// Dette forbinder vores React app til HTML siden
createRoot(document.getElementById("root")).render(
  // StrictMode hjælper os med at skrive bedre kode ved at vise advarsler
  <StrictMode>
    {/* BrowserRouter muliggør routing (navigation mellem sider) */}
    <BrowserRouter>
      {/* Vores hoved App komponent - dette starter alt */}
      <App />
    </BrowserRouter>
  </StrictMode>
);