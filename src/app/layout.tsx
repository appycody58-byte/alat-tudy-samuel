import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ALAT by Wema — Banking Without Limits",
  description:
    "Nigeria's first fully digital bank. Voice banking, instant loans, virtual cards, Tap & Pay, and more — reimagined.",
  openGraph: {
    title: "ALAT by Wema — Banking Without Limits",
    description: "Audacity. Limitlessness. Aspiration. Timelessness.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-alat-navy text-white overflow-x-hidden">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
