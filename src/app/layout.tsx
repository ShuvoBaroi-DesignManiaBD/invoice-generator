import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { createClient } from "@/utils/supabase/server";
import { ThemeSync } from "@/components/theme-sync";
import { Footer } from "@/components/layout/footer";

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
    default: "Invoice Generator | Professional Invoicing Made Simple",
    template: "%s | Invoice Generator",
  },
  description:
    "Create professional invoices in seconds. Free invoice generator for freelancers and small businesses. PDF export, client management, and more.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "invoice template",
    "freelance invoice",
    "billing software",
  ],
  authors: [{ name: "Invoice Generator Team" }],
  creator: "Invoice Generator",
  metadataBase: new URL(
    process.env.BASE_URL || "https://invoice-generator.vercel.app",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.BASE_URL || "https://invoice-generator.vercel.app",
    title: "Invoice Generator | Professional Invoicing Made Simple",
    description:
      "Create professional invoices in seconds. Free invoice generator for freelancers and small businesses.",
    siteName: "Invoice Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Generator | Professional Invoicing Made Simple",
    description:
      "Create professional invoices in seconds. Free invoice generator for freelancers and small businesses.",
    creator: "@invoicegenerator",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSync
            themePreference={data.user?.user_metadata?.theme_preference}
          />
          <Header user={data.user} />
          <main className="mx-auto h-full overflow-hidden">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
    </html>
  );
}
