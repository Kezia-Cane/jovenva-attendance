import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JovenVA Attendance",
  description: "Attendance Management System",
};

import { MobileBlocker } from "@/components/layout/MobileBlocker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MobileBlocker />
        {children}
      </body>
    </html>
  );
}
