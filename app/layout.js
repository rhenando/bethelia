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

export const metadata = {
  title: "Bethelia: Online Shopping PH | Mobiles, Beauty, Appliances, Fashion",
  description:
    "Shop the Best Products &amp; Brands in Philippines. ✓ Buy Now, Pay Later ✓ Same Day Delivery ✓ Cash on Delivery ✓ Easy Free Returns ✓ Credit Cards &amp; Debit Cards.",
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
