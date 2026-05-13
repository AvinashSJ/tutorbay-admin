/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tutorbay Superadmin",
  description: "Tutorbay superadmin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" href="/tutorbay_-removebg-preview.png" type="image/png" />
        <link rel="stylesheet" href="/assets/css/lib/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/remixicon.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
