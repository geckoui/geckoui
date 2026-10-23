import { GeckoHome } from "@/components/home/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "GeckoUI — React component library" },
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return <GeckoHome />;
}
