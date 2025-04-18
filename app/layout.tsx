import type { Metadata } from "next";
import { Mona_Sans as MonaSansFont } from "next/font/google";
import "./globals.css";

const monaSans = MonaSansFont({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Alan",
  description: "AI Driven Interview For Interview Preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.variable} antialiased pattern`}
      >
        {children}
      </body>
    </html>
  );
}
