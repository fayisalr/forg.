import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-5xl">
      <h1 className="text-5xl font-bold text-white mb-12 text-center">Get in <span className="text-orange-500">Touch</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Studio Location</h3>
                <p className="text-gray-400">123 Media Avenue, Creative District<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Phone / WhatsApp</h3>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                <p className="text-gray-400">hello@forgstudio.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-900 p-8 rounded-sm border border-white/5">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input type="email" className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea rows={5} className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Tell us about your project..."></textarea>
            </div>
            <button className="w-full bg-orange-500 text-black font-bold py-4 rounded-sm hover:bg-orange-400 transition-colors uppercase tracking-widest text-sm">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
