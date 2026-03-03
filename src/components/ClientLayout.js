"use client";
import { useRouter } from "next/navigation";

import Navbar from "./Navbar";
import TimeOut from "./TimeOut";
import { logout } from "../app/login/action";

export default function ClientLayout({ children, user }) {
  const handleSuppSession = async () => {
    await logout();
  };

  return (
    <>
      {user && <TimeOut onComplete={handleSuppSession} />}
      <Navbar user={user} />
      {children}
    </>
  );
}
