import React from "react";
import { isMobile } from "./utility";
import { DaysProvider } from "./components/DaysContext"; // Import the DaysProvider

import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";

function App() {
  const isUserOnMobile = isMobile();

  return (
    <DaysProvider>
      {" "}
      {/* Wrap the components with DaysProvider */}
      {isUserOnMobile ? <MobileApp /> : <DesktopApp />}
    </DaysProvider>
  );
}

export default App;
