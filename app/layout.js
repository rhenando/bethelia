import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/app/Providers";
import { Toaster } from "sonner";
import LayoutShell from "@/components/LayoutShell"; // <-- import the wrapper
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/page.js or app/layout.js
export const metadata = {
  title: "Bethelia: Shop Philippines Best Products Online",
  description:
    "Explore mobiles, fashion, home appliances, and more at Bethelia. Secure payments. Fast delivery. Easy returns.",
  keywords: "shop online philippines, bethelia, mobiles, appliances, fashion",
  openGraph: {
    title: "Bethelia - Shop Online Philippines",
    description: "Fast delivery, secure checkout, the best brands in PH.",
    url: "https://bethelia.com",
    siteName: "Bethelia",
    images: [
      {
        url: "/bethelia-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bethelia Online Shopping",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bethelia: Shop PH’s Best Brands",
    description: "Online shopping in PH for mobiles, appliances, and more.",
    images: ["/bethelia-og-image.jpg"],
  },
  alternates: {
    canonical: "https://bethelia.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 min-h-screen`}
      >
        <div className='flex justify-center min-h-screen bg-gray-100'>
          <div className='w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-xl'>
            <Providers>
              <Toaster position='top-center' richColors />
              <LayoutShell>{children}</LayoutShell>
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
