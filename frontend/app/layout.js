import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ConsoleHub",
  description: "E-comerce for gamers",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={inter.className}>
        {children}</body>
    </html>
    </AuthProvider>
  );
}
