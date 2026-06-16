"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Camera, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Camera className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
          <span className="text-2xl font-bold tracking-widest text-white group-hover:text-orange-500 transition-colors">FORG<span className="text-orange-500">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link href="/" className="hover:text-orange-500 transition-colors text-gray-300">HOME</Link>
          <Link href="/about" className="hover:text-orange-500 transition-colors text-gray-300">ABOUT</Link>
          <Link href="/services" className="hover:text-orange-500 transition-colors text-gray-300">SERVICES</Link>
          <Link href="/portfolio" className="hover:text-orange-500 transition-colors text-gray-300">PORTFOLIO</Link>
          <Link href="/contact" className="hover:text-orange-500 transition-colors text-gray-300">CONTACT</Link>
        </nav>
        <div className="hidden md:flex">
          <Link href="/auth/login" className="px-5 py-2.5 text-sm font-bold bg-orange-500 text-black rounded-sm hover:bg-orange-400 transition-colors uppercase">
            Portal Access
          </Link>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-orange-500 focus:outline-none"
          title="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 px-4 py-6 space-y-4 flex flex-col text-sm font-semibold tracking-wide">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="hover:text-orange-500 transition-colors py-2 text-gray-300 border-b border-white/5"
          >
            HOME
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsOpen(false)}
            className="hover:text-orange-500 transition-colors py-2 text-gray-300 border-b border-white/5"
          >
            ABOUT
          </Link>
          <Link 
            href="/services" 
            onClick={() => setIsOpen(false)}
            className="hover:text-orange-500 transition-colors py-2 text-gray-300 border-b border-white/5"
          >
            SERVICES
          </Link>
          <Link 
            href="/portfolio" 
            onClick={() => setIsOpen(false)}
            className="hover:text-orange-500 transition-colors py-2 text-gray-300 border-b border-white/5"
          >
            PORTFOLIO
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setIsOpen(false)}
            className="hover:text-orange-500 transition-colors py-2 text-gray-300 border-b border-white/5"
          >
            CONTACT
          </Link>
          <Link 
            href="/auth/login" 
            onClick={() => setIsOpen(false)}
            className="w-full text-center px-5 py-3 text-sm font-bold bg-orange-500 text-black rounded-sm hover:bg-orange-400 transition-colors uppercase block mt-4"
          >
            Portal Access
          </Link>
        </div>
      )}
    </header>
  );
}
