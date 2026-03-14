"use client";
import Navbar from "./Navbar";
import TimeOut from "./TimeOut";
import { logout } from "../app/login/action";

export default function ClientLayout({ children, user }) {
  const handleSuppSession = async () => {
    await logout();
  };

  return (
    <>
      {user && user.userId !== "client_001" && (
        <TimeOut onComplete={handleSuppSession} />
      )}
      <Navbar user={user} />
      {children}
    </>
  );
}
