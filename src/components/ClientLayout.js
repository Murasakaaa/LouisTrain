"use client";

import Navbar from "./Navbar";
import TimeOut from "./TimeOut";
import { deleteSession } from "../lib/session";

export default function ClientLayout({ children }) {
  const handleSuppSession = () => {
    deleteSession();
  };

  return (
    <>
      {/* Afficher le TimeOut que quand on est connecte et que c un client */}
      <TimeOut onComplete={handleSuppSession} />
      <Navbar />
      {children}
    </>
  );
}
