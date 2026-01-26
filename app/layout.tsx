import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JovenVA Attendance",
  description: "Attendance Management System",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

import { MobileBlocker } from "@/components/layout/MobileBlocker";
import { MaintenanceBlocker } from "@/components/layout/MaintenanceBlocker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MaintenanceBlocker />
        <MobileBlocker />
        {children}
      </body>
    </html>
  );
}
