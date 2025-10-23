import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

const robotoCondensed = Roboto_Condensed({
  weight: ["400","500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  style: ["normal"],
  display: "swap",
});
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "RollThePay",
    template: "%s | RollThePay",
  },
  description: "Accurate salary data by country and state.",
  metadataBase: new URL("https://rollthepay.com"),
  robots: {
    index: true,
    follow: true
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoCondensed.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1KV83TTJVP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1KV83TTJVP');
          `}
        </Script>
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "tqvkhdpf8r");
                `}
        </Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4388164731251182"
          crossOrigin="anonymous" id="adsbygoogle-script" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Footer />
      </body>
    </html>
  );
}
