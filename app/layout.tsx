import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Top Reasons — Premium Car Rental in Ghana",
  description:
    "Rent quality cars across Ghana with Top Reasons — the trusted choice for airport transfers, city travel, and premium car rental in Accra.",
  keywords: "car rental Ghana, car hire Accra, airport transfer Ghana, Top Reasons",
  openGraph: {
    title: "Top Reasons — Premium Car Rental in Ghana",
    description:
      "Rent quality cars across Ghana with Top Reasons — the trusted choice for airport transfers, city travel, and premium car rental in Accra.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
