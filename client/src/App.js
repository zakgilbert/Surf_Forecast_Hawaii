import React, { useEffect, useState } from "react";
import { isMobile } from "./utility";
import { DaysProvider } from "./components/DaysContext";

import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";

function App() {
  const isUserOnMobile = isMobile();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isUserOnMobile) return;

    const handleKeyDown = (e) => {
      if (e.key === "/") {
        const target = e.target;
        const isTyping =
          target instanceof HTMLElement &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);

        if (!isTyping) {
          e.preventDefault();
          document.querySelector(".app-header-search")?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUserOnMobile]);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="title-container">
          {!isUserOnMobile && (
            <button
              type="button"
              className="app-menu-button"
              onClick={() => setDesktopSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
              aria-expanded={desktopSidebarOpen}
            >
              <span />
              <span />
              <span />
            </button>
          )}

          <div className="app-header-text">
            <h1
              className="app-title"
              title="Surf Forecast Hawaii is a one-page dashboard to compare Hawaii surf forecasts, buoys, tides, and charts all at once."
            >
              Surf Forecast Hawaii
            </h1>
          </div>

          {!isUserOnMobile && (
            <input
              className="app-header-search"
              type="search"
              placeholder="Search Buoy"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search buoy"
            />
          )}
        </div>
      </header>

      <DaysProvider>
        <main className="app-main">
          {isUserOnMobile ? (
            <MobileApp />
          ) : (
            <DesktopApp
              sidebarOpen={desktopSidebarOpen}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        </main>
      </DaysProvider>

      <footer className="app-footer">
        <p className="app-subtitle">Powered by the MyHagi API</p>
      </footer>
    </div>
  );
}

export default App;