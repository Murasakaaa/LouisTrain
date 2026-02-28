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
      <TimeOut onComplete={handleSuppSession} />
      <Navbar />
      {children}
    </>
  );
}
