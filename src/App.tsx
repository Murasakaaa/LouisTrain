import { useState } from "react";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar isConnected={false} userName="Louis Tran" />
      <Admin />
    </main>
  );
}

export default App;
