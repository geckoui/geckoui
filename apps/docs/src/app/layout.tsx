import "@/components/docs/docs.css";
import { classNames } from "@/lib/classNames";
import { siteUrl } from "@/lib/site";
import { GeckoUIProvider } from "@geckoui/geckoui";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";

import "./global.css";

const description =
  "GeckoUI (Gecko UI) is a React component library with 40+ accessible, typed components, react-hook-form wrappers and CSS variable themes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GeckoUI — React component library",
    template: "%s | GeckoUI"
  },
  description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "GeckoUI",
    description,
    images: ["/logo.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "GeckoUI",
    description,
    images: ["/logo.png"]
  }
};

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={classNames(geistSans.variable, geistMono.variable)}
      suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <GeckoUIProvider>{children}</GeckoUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
