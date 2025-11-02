import {
  Facebook,
  Instagram,
  Youtube,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className='bg-[#1e5c8a] text-white mt-12'>
      {/* --- Top Section --- */}
      <div className='container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
        {/* About */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>About Bethelia</h3>
          <ul className='space-y-2 text-sm text-white/80'>
            <li>
              <Link to='/about' className='hover:text-white'>
                About Us
              </Link>
            </li>
            <li>
              <Link to='/careers' className='hover:text-white'>
                Careers
              </Link>
            </li>
            <li>
              <Link to='/privacy' className='hover:text-white'>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to='/terms' className='hover:text-white'>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Customer Service</h3>
          <ul className='space-y-2 text-sm text-white/80'>
            <li>
              <Link to='/help' className='hover:text-white'>
                Help Center
              </Link>
            </li>
            <li>
              <Link to='/returns' className='hover:text-white'>
                Return & Refunds
              </Link>
            </li>
            <li>
              <Link to='/shipping' className='hover:text-white'>
                Shipping Information
              </Link>
            </li>
            <li>
              <Link to='/contact' className='hover:text-white'>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Payment & Delivery</h3>
          <ul className='space-y-3 text-sm text-white/80'>
            <li className='flex items-center gap-2'>
              <CreditCard size={16} /> GCash, Maya, Credit & Debit
            </li>
            <li className='flex items-center gap-2'>
              <Truck size={16} /> Nationwide Delivery
            </li>
            <li className='flex items-center gap-2'>
              <Shield size={16} /> Secure Checkout
            </li>
            <li className='flex items-center gap-2'>
              <span className='font-semibold'>COD</span> (Cash on Delivery
              available)
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Follow Us</h3>
          <div className='flex gap-4 mb-4'>
            <a
              href='https://facebook.com'
              target='_blank'
              className='hover:text-yellow-300'
            >
              <Facebook size={20} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              className='hover:text-yellow-300'
            >
              <Instagram size={20} />
            </a>
            <a
              href='https://youtube.com'
              target='_blank'
              className='hover:text-yellow-300'
            >
              <Youtube size={20} />
            </a>
          </div>
          <p className='text-sm text-white/80'>
            Stay updated with our latest offers and exclusive discounts.
          </p>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className='border-t border-white/20 mt-8'>
        <div className='container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/70'>
          <p>© {new Date().getFullYear()} Bethelia PH. All Rights Reserved.</p>
          <p>Made with 💙 in Bulacan</p>
        </div>
      </div>
    </footer>
  );
}
