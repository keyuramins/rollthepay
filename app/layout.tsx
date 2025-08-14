import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Roll The Pay",
    template: "%s | Roll The Pay",
  },
  description: "Accurate salary data by country and state.",
  metadataBase: new URL("https://rollthepay.example"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopLoader 
          color="#3b82f6"
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        {children}
      </body>
    </html>
  );
}
