import "./globals.css";

import ClientLayout from "../components/ClientLayout";
import { getCurrentUser } from "@/lib/session";

export const metadata = {
  title: "Louis Train - Réservation",
  description: "Réservez vos billets de train facilement.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body>
        <ClientLayout user={user}>{children}</ClientLayout>
      </body>
    </html>
  );
}
