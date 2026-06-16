"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, X } from 'lucide-react';

const DEFAULT_CONFIG = {
  hero: {
    title: "CRAFTING VISUAL LEGACIES",
    description: "FORG Studio is a premium media production agency dedicated to elevating brands through cinematic storytelling and stunning photography.",
    ctaText: "VIEW PORTFOLIO",
    bgImageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop",
    showreelUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ"
  },
  services: [
    {
      title: "Photography",
      description: "Commercial, editorial, and portrait photography that captures the essence of your brand.",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Videography",
      description: "Cinematic video production from concept to final cut for commercials and brand films.",
      imageUrl: "https://images.unsplash.com/photo-1589087413645-09591e138a0c?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Post-Production",
      description: "High-end retouching, color grading, and editing to perfect every visual element.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
    }
  ],
  cta: {
    headline: "READY TO TELL YOUR STORY?",
    description: "Let's collaborate to create visually stunning media that resonates with your audience.",
    buttonText: "Start a Project"
  }
};

import { getHomeConfig } from '@/app/actions';

export default function HomePage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showreelOpen, setShowreelOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      // Try to load from database first
      const dbConfig = await getHomeConfig();
      if (dbConfig) {
        setConfig(dbConfig);
        return;
      }
      
      // Fallback to localStorage if database config is empty
      const saved = localStorage.getItem('forg_home_config');
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse local homepage configuration:", e);
        }
      }
    }
    loadConfig();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background image/media */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/60 to-black z-10" />
          <img 
            src={config.hero.bgImageUrl} 
            alt="Studio Background" 
            className="w-full h-full object-cover opacity-45 mix-blend-luminosity"
          />
        </div>
        
        <div className="container relative z-20 px-4 mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 uppercase leading-tight max-w-5xl mx-auto">
            {config.hero.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {config.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto sm:max-w-none">
            <Link href="/portfolio" className="px-8 py-4 bg-orange-500 text-black font-bold tracking-wide rounded-sm hover:bg-white transition-all w-full sm:w-auto flex items-center justify-center gap-2">
              {config.hero.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setShowreelOpen(true)}
              className="px-8 py-4 bg-transparent border border-white text-white font-bold tracking-wide rounded-sm hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> SHOWREEL
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-orange-500 tracking-widest text-sm font-bold uppercase mb-3">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white uppercase">Featured Services</h3>
            </div>
            <Link href="/services" className="text-gray-400 hover:text-orange-500 transition-colors mt-6 md:mt-0 flex items-center gap-2 uppercase text-sm font-bold tracking-widest">
              All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.services.map((service, idx) => (
              <div key={idx} className="group relative overflow-hidden bg-neutral-900 aspect-[4/5] rounded-sm border border-white/5">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h4 className="text-2xl font-bold text-white mb-2 uppercase">{service.title}</h4>
                  <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-black border-t border-white/5">
        <div className="absolute inset-0 bg-orange-600/10" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 uppercase">{config.cta.headline}</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">{config.cta.description}</p>
          <Link href="/contact" className="px-10 py-4 bg-orange-500 text-black font-bold tracking-widest uppercase rounded-sm hover:bg-white transition-colors inline-block text-sm">
            {config.cta.buttonText}
          </Link>
        </div>
      </section>

      {/* Showreel Overlay Modal */}
      {showreelOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-neutral-950 border border-white/10 rounded-sm overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowreelOpen(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-neutral-800 text-white p-2 rounded-sm z-50 transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe 
              src={config.hero.showreelUrl} 
              title="FORG Studio Showreel" 
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
