import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const footerLinks = {
  information: ["Videos", "Reviews", "Authenticity", "Discount Codes", "Gift Cards"],
  topCollections: ["Air Jordan 4", "ASICS", "Cleens", "Fear of God Essentials", "Nike", "Reprimo", "Saucony"],
  customerService: ["My Account", "Create a Return", "Track Your Order", "FAQs", "Contact Us", "Refund Policy", "Privacy Policy", "Terms of Service", "Shipping Policy"]
};

export default function Footer() {
  return (
    <footer className="bg-[#F3F1E9] pt-20 pb-10 px-10 border-t border-gray-200">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Newsletter */}
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-black leading-tight uppercase mb-8 max-w-md">
            Get 10% off your first order when signing up to our newsletter
          </h2>
          <div className="relative mb-8 max-w-lg">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-transparent border-b border-gray-400 py-3 focus:outline-none focus:border-black transition-colors placeholder:text-gray-400"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-xl">
              &rarr;
            </button>
          </div>
          
          <div className="flex gap-6 text-xl text-black">
            <FaFacebookF className="cursor-pointer hover:opacity-60" />
            <FaInstagram className="cursor-pointer hover:opacity-60" />
            <FaXTwitter className="cursor-pointer hover:opacity-60" />
            <FaYoutube className="cursor-pointer hover:opacity-60" />
            <FaLinkedinIn className="cursor-pointer hover:opacity-60" />
            <FaEnvelope className="cursor-pointer hover:opacity-60" />
          </div>
        </div>

        {/* Right Columns: Links */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Information</h4>
            <ul className="space-y-4">
              {footerLinks.information.map(link => (
                <li key={link} className="text-sm text-gray-600 hover:text-black cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Top Collections</h4>
            <ul className="space-y-4">
              {footerLinks.topCollections.map(link => (
                <li key={link} className="text-sm text-gray-600 hover:text-black cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest mb-6">Customer Service</h4>
            <ul className="space-y-4">
              {footerLinks.customerService.map(link => (
                <li key={link} className="text-sm text-gray-600 hover:text-black cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payments and Legal */}
      <div className="max-w-[1500px] mx-auto mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          © Limited | Company No. 08761997 VAT No. GB179081090
        </p>
        
        <div className="flex items-center gap-4 grayscale opacity-80">
          {/* Use specific SVG/Image icons for payment methods here */}
          <div className="flex gap-2">
            {["AMEX", "ApplePay", "Discover", "GPay", "Klarna", "Maestro", "Mastercard", "PayPal", "Visa"].map(pay => (
              <div key={pay} className="w-8 h-5 bg-gray-300 rounded-sm"></div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold border-l pl-4 ml-4">
            🇬🇧 GBP (£) <span>▼</span>
          </div>
        </div>
      </div>
    </footer>
  );
}