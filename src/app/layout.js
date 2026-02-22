import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Louis Train - Réservation",
  description: "Réservez vos billets de train facilement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
