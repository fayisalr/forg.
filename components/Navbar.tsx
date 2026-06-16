import Link from 'next/link';
import { Camera, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Camera className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
          <span className="text-2xl font-bold tracking-widest text-white group-hover:text-orange-500 transition-colors">FORG<span className="text-orange-500">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link href="/" className="hover:text-orange-500 transition-colors">HOME</Link>
          <Link href="/about" className="hover:text-orange-500 transition-colors">ABOUT</Link>
          <Link href="/services" className="hover:text-orange-500 transition-colors">SERVICES</Link>
          <Link href="/portfolio" className="hover:text-orange-500 transition-colors">PORTFOLIO</Link>
          <Link href="/contact" className="hover:text-orange-500 transition-colors">CONTACT</Link>
        </nav>
        <div className="hidden md:flex">
          <Link href="/auth/login" className="px-5 py-2.5 text-sm font-bold bg-orange-500 text-black rounded-sm hover:bg-orange-400 transition-colors uppercase">
            Portal Access
          </Link>
        </div>
        <button className="md:hidden text-white hover:text-orange-500">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
