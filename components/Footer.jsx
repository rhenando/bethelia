"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white pt-16 pb-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12'>
          {/* Footer columns - you can fill these in as needed */}
          <div>
            <h3 className='font-semibold mb-3'>Company</h3>
            <ul className='text-gray-400 space-y-2'>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Buyers</h3>
            <ul className='text-gray-400 space-y-2'>
              <li>How to Buy</li>
              <li>Buyer Protection</li>
              <li>Logistics Services</li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Suppliers</h3>
            <ul className='text-gray-400 space-y-2'>
              <li>Join as Supplier</li>
              <li>Supplier Dashboard</li>
              <li>Trade Assurance</li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Resources</h3>
            <ul className='text-gray-400 space-y-2'>
              <li>Help Center</li>
              <li>Contact Support</li>
              <li>Community</li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Legal</h3>
            <ul className='text-gray-400 space-y-2'>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Cookie Settings</li>
            </ul>
          </div>
        </div>

        <Separator className='bg-gray-700 mb-8' />

        <div className='flex flex-col md:flex-row justify-between'>
          <p className='text-gray-400'>
            © 2025 GlobalTrade. All rights reserved.
          </p>
          <div className='flex gap-6 items-center mt-4 md:mt-0'>
            <div className='flex gap-2 text-xl'>
              <i className='fab fa-cc-visa'></i>
              <i className='fab fa-cc-mastercard'></i>
              <i className='fab fa-cc-paypal'></i>
              <i className='fab fa-cc-amex'></i>
            </div>
            <div className='flex items-center text-sm'>
              <span className='text-gray-400 mr-2'>Language:</span>
              <span>
                English <i className='fas fa-chevron-down ml-1 text-xs'></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
