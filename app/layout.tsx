import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StephenOS Dashboard",
  description: "Personal AI dashboard for Stephen Oldfield",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-neutral-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
