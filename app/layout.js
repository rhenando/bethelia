import "./globals.css";
import ClientProviders from "./ClientProviders";

import LayoutShell from "@/components/LayoutShell";

export const metadata = {
  title: "Bethelia: Shop Philippines Best Products Online",
  description:
    "Explore mobiles, fashion, home appliances, and more at Bethelia. Secure payments. Fast delivery. Easy returns.",
  metadataBase: new URL("https://bethelia.com"),

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
      <body className='antialiased bg-gray-100 min-h-screen overflow-x-hidden'>
        <ClientProviders>
          <div className='flex justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-[430px] min-h-screen bg-white flex flex-col shadow-xl relative pt-safe-top pb-safe-bottom'>
              <LayoutShell>{children}</LayoutShell>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
