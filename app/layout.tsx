import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const robotoCondensed = Roboto_Condensed({
  weight: ["400","700"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
});
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "RollThePay",
    template: "%s | RollThePay",
  },
  description: "Accurate salary data by country and state.",
  metadataBase: new URL("https://rollthepay.serveriko.com"),
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
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} ${inter.variable}`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
