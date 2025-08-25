import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//  import TopLoader from "nextjs-toploader";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    default: "RollThePay",
    template: "%s | RollThePay",
  },
  description: "Accurate salary data by country and state.",
  metadataBase: new URL("https://rollthepay.example"),
  robots: {
    index: false,
    follow: false
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        {/* <TopLoader 
          color="#3b82f6"
          showSpinner={false}
          easing="ease"
          speed={200}
        /> */}
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
