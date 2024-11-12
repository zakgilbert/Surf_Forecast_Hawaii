import React from "react";
import { isMobile } from "./utility"

import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";

function App() {
  const isUserOnMobile = isMobile();

  return (
    <div className="App">{isUserOnMobile ? <MobileApp /> : <DesktopApp />}</div>
  );
}

export default App;
