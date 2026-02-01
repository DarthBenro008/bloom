import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bloom - Do the work. Watch it bloom.",
  description: "A gamified accountability app that turns your productivity into a living garden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/tasks"
          social={{
            providers: ["google"],
          }}
        >
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
