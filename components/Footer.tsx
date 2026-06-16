import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold tracking-widest text-white mb-6">FORG<span className="text-orange-500">.</span></h2>
            <p className="text-gray-400 max-w-sm">
              Premium media production agency specializing in high-end photography and videography for forward-thinking brands.
            </p>
          </div>
          <div>
            <h3 className="text-orange-500 font-bold tracking-wider mb-6 text-sm uppercase">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-orange-500 font-bold tracking-wider mb-6 text-sm uppercase">Contact</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>hello@forgstudio.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Media Avenue<br />Creative District, NY 10001</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FORG Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-orange-500 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Vimeo</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
