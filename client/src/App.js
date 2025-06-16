/**
 * App.js
 */
import React from "react";
import { isMobile } from "./utility";
import { DaysProvider } from "./components/DaysContext"; // Import the DaysProvider

import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";

function App() {
  const isUserOnMobile = isMobile();

  return (
    <>
      <header className="app-header">
        <div className="title-container">
          <h1 className="app-title">Surf Forecast Hawaii</h1>
          <p className="app-subtitle">Powered by the MyHagi API</p>
        </div>
      </header>
      <DaysProvider>
        {" "}
        {/* Wrap the components with DaysProvider */}
        {isUserOnMobile ? <MobileApp /> : <DesktopApp />}
      </DaysProvider>
    </>
  );
}

export default App;
