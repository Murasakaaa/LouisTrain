import { useState } from "react";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import HomePage from "./pages/HomePage";

import "./App.css";

function App() {
  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar isConnected={false} userName="Louis Tran" isWhite={true} />
      {/* <Admin /> */}
      <HomePage />
    </main>
  );
}

export default App;
