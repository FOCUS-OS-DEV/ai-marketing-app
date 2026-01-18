import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Marketing Bootcamp",
  description: "מערכת ניהול תוכניות הבוטקאמפ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased min-h-screen bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
