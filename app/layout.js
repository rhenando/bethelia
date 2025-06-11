// app/layout.js
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import AppProviders from "./AppProviders"; // <-- your providers
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bethelia",
  description: "Nationwide Trade Hub",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <ClientLayout>
            {children}
            <Toaster richColors />
          </ClientLayout>
        </AppProviders>
      </body>
    </html>
  );
}
