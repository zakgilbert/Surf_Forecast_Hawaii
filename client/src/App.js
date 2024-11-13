import React from "react";
import { isMobile } from "./utility";

import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";

function App() {
  const isUserOnMobile = isMobile();

  return <>{isUserOnMobile ? <MobileApp/> : <DesktopApp />}</>;
}

export default App;
