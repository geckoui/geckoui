import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/docs" />
      <link rel="canonical" href="/docs" />
    </>
  );
}
