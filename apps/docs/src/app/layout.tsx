import { GeckoUIPortal } from "@geckoui/geckoui";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import SearchDialog from "@/components/search";

import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "Gecko UI",
    template: "%s | Gecko UI"
  },
  description: "Gecko UI — because your app deserves to be cute AND powerful.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "Gecko UI",
    description: "Gecko UI — because your app deserves to be cute AND powerful.",
    images: ["/logo.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Gecko UI",
    description: "Gecko UI — because your app deserves to be cute AND powerful.",
    images: ["/logo.png"]
  }
};

const inter = Inter({
  subsets: ["latin"]
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
        <GeckoUIPortal />
      </body>
    </html>
  );
}
