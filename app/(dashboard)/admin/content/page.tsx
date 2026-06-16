"use client";
import { useState, useEffect } from 'react';
import { Settings, Info, Image, Film, Plus, Trash2, CheckCircle2, Globe, Save, Play, Link as LinkIcon } from 'lucide-react';

interface CustomService {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  type: 'Photo' | 'Video';
  category: 'Commercial' | 'Fashion' | 'Events' | 'Short Film';
  url: string;
}

const DEFAULT_HOME_CONFIG = {
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

export default function WebsiteContentManager() {
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'cta' | 'portfolio' | 'custom_services' | 'contact'>('hero');
  const [notification, setNotification] = useState<string | null>(null);

  // 1. Home Config State
  const [homeConfig, setHomeConfig] = useState(DEFAULT_HOME_CONFIG);

  // Load configuration from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('forg_home_config');
    if (saved) {
      try {
        setHomeConfig(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Save Home Configuration
  const handleSaveHomeConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('forg_home_config', JSON.stringify(homeConfig));
    triggerNotification("Homepage settings updated successfully! Rebuild triggered.");
  };

  // Helper to update specific subfields in homeConfig
  const updateHeroField = (field: keyof typeof DEFAULT_HOME_CONFIG.hero, value: string) => {
    setHomeConfig({
      ...homeConfig,
      hero: {
        ...homeConfig.hero,
        [field]: value
      }
    });
  };

  const updateServiceField = (index: number, field: 'title' | 'description' | 'imageUrl', value: string) => {
    const updatedServices = [...homeConfig.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setHomeConfig({
      ...homeConfig,
      services: updatedServices
    });
  };

  const updateCtaField = (field: keyof typeof DEFAULT_HOME_CONFIG.cta, value: string) => {
    setHomeConfig({
      ...homeConfig,
      cta: {
        ...homeConfig.cta,
        [field]: value
      }
    });
  };

  // 2. Custom Services list state (Separate from homepage featured spots)
  const [customServices, setCustomServices] = useState<CustomService[]>([
    { id: 1, title: "Cinematography", desc: "High-end commercial videography, drone visuals, and brand films shot in 4K resolution.", icon: "Camera" },
    { id: 2, title: "Video Editing", desc: "Expert video narrative pacing, transition design, and multi-cam assembly rendering.", icon: "Scissors" },
    { id: 3, title: "Color Grading", desc: "Cinematic coloring, LUT setups, tone correction, and color matching for mood consistency.", icon: "Palette" },
    { id: 4, title: "Sound Design", desc: "Ambience creation, Foley effects, sound mixes, and custom soundtrack overlays.", icon: "Volume2" }
  ]);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // 3. Portfolio items list state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: 1, title: "Reebok Z-Run Ad", type: "Video", category: "Commercial", url: "/portfolio/reebok.mp4" },
    { id: 2, title: "Vogue Summer Shoot", type: "Photo", category: "Fashion", url: "/portfolio/vogue-summer.jpg" },
    { id: 3, title: "BMW M5 cinematic reel", type: "Video", category: "Commercial", url: "/portfolio/bmw.mp4" },
    { id: 4, title: "Wedding in Udaipur", type: "Photo", category: "Events", url: "/portfolio/udaipur.jpg" },
  ]);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortType, setNewPortType] = useState<'Photo' | 'Video'>('Video');
  const [newPortCat, setNewPortCat] = useState<PortfolioItem['category']>('Commercial');
  const [newPortUrl, setNewPortUrl] = useState('');

  // 4. Contact details state
  const [contactEmail, setContactEmail] = useState("hello@forgstudio.com");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [contactAddress, setContactAddress] = useState("Studio 4A, Creative Hub, Kochi, India");
  const [whatsAppLink, setWhatsAppLink] = useState("https://wa.me/919876543210");

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    triggerNotification("Contact information updated successfully!");
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle || !newServiceDesc) return;
    const newService: CustomService = {
      id: Date.now(),
      title: newServiceTitle,
      desc: newServiceDesc,
      icon: "Camera"
    };
    setCustomServices([...customServices, newService]);
    setNewServiceTitle('');
    setNewServiceDesc('');
    triggerNotification(`Service '${newServiceTitle}' added.`);
  };

  const handleDeleteCustomService = (id: number) => {
    const sName = customServices.find(s => s.id === id)?.title;
    setCustomServices(customServices.filter(s => s.id !== id));
    triggerNotification(`Service '${sName}' removed.`);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle || !newPortUrl) return;
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: newPortTitle,
      type: newPortType,
      category: newPortCat,
      url: newPortUrl
    };
    setPortfolio([...portfolio, newItem]);
    setNewPortTitle('');
    setNewPortUrl('');
    triggerNotification(`Portfolio item '${newPortTitle}' uploaded.`);
  };

  const handleDeletePortfolio = (id: number) => {
    const pTitle = portfolio.find(p => p.id === id)?.title;
    setPortfolio(portfolio.filter(p => p.id !== id));
    triggerNotification(`Portfolio item '${pTitle}' deleted.`);
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Globe className="w-8 h-8 text-orange-500" /> Website Content Manager
          </h1>
          <p className="text-gray-400 text-sm mt-1">Configure layout, text values, services grid, and the live cinematic showreel on the public site.</p>
        </div>
        <button 
          onClick={() => triggerNotification("Live website production caches flushed successfully.")}
          className="bg-black hover:bg-neutral-800 text-orange-500 border border-orange-500/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
        >
          Rebuild Live site
        </button>
      </div>

      {/* Floating notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-orange-500 text-black px-4 py-3 rounded-sm font-semibold text-sm shadow-lg z-50 flex items-center gap-2 transition-all">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab select triggers */}
      <div className="flex border-b border-white/5 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'hero' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Hero & Showreel
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'services' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Home Services Grid
        </button>
        <button 
          onClick={() => setActiveTab('cta')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'cta' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Home CTA Footer
        </button>
        <button 
          onClick={() => setActiveTab('custom_services')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'custom_services' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Custom Services list
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'portfolio' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Portfolio Library
        </button>
        <button 
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'contact' ? 'border-orange-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Contact Info
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6">

        {/* Tab 1: Hero & Showreel */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHomeConfig} className="space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Homepage Hero & Showreel Video Settings</h2>
              <p className="text-xs text-gray-500 mt-1">Configure landing headlines, buttons, background visual media, and display the live showreel.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Form inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Headline Headline</label>
                  <input 
                    type="text" 
                    required
                    value={homeConfig.hero.title}
                    onChange={(e) => updateHeroField('title', e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Subheading Paragraph</label>
                  <textarea 
                    rows={4}
                    required
                    value={homeConfig.hero.description}
                    onChange={(e) => updateHeroField('description', e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Primary Button Label</label>
                    <input 
                      type="text" 
                      required
                      value={homeConfig.hero.ctaText}
                      onChange={(e) => updateHeroField('ctaText', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Background Image URL</label>
                    <input 
                      type="text" 
                      required
                      value={homeConfig.hero.bgImageUrl}
                      onChange={(e) => updateHeroField('bgImageUrl', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-orange-500" /> Showreel Embed URL (YouTube/Vimeo)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={homeConfig.hero.showreelUrl}
                    onChange={(e) => updateHeroField('showreelUrl', e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors text-xs font-mono"
                  />
                  <span className="text-[10px] text-gray-500 mt-2 block">Make sure to use the embed format, e.g., `https://www.youtube.com/embed/&lt;id&gt;`</span>
                </div>
              </div>

              {/* Showreel Preview Player Area */}
              <div className="space-y-4">
                <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Showreel Video Player Space
                </label>
                <div className="w-full aspect-video bg-black rounded-sm border border-white/10 overflow-hidden shadow-inner flex items-center justify-center relative">
                  {homeConfig.hero.showreelUrl ? (
                    <iframe 
                      src={homeConfig.hero.showreelUrl} 
                      title="Showreel Preview" 
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <span className="text-gray-500 text-xs">No video URL specified.</span>
                  )}
                </div>
                <div className="bg-black/30 border border-white/5 p-4 rounded-sm">
                  <h4 className="text-xs font-bold text-white mb-1">Preview Player Guidelines</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    This video plays when visitors click the **SHOWREEL** button on the public home page. It is recommended to use a high-energy 60-90 second cinematic summary cut.
                  </p>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="bg-orange-500 text-black px-6 py-3 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" /> Save Hero settings
            </button>
          </form>
        )}

        {/* Tab 2: Homepage Services grid */}
        {activeTab === 'services' && (
          <form onSubmit={handleSaveHomeConfig} className="space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Homepage Services Grid (3 Spots)</h2>
              <p className="text-xs text-gray-500 mt-1">Customize the three main categories showcased on the homepage services panel.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {homeConfig.services.map((spot, idx) => (
                <div key={idx} className="bg-black/50 border border-white/5 p-5 rounded-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Spot #{idx + 1}</span>
                    <div className="w-16 h-10 bg-neutral-900 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center">
                      <img src={spot.imageUrl} className="w-full h-full object-cover opacity-60" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Category Title</label>
                    <input 
                      type="text" 
                      required
                      value={spot.title}
                      onChange={(e) => updateServiceField(idx, 'title', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Brief Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={spot.description}
                      onChange={(e) => updateServiceField(idx, 'description', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Cover Image URL</label>
                    <input 
                      type="text" 
                      required
                      value={spot.imageUrl}
                      onChange={(e) => updateServiceField(idx, 'imageUrl', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-[10px] text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit"
              className="bg-orange-500 text-black px-6 py-3 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Services Grid
            </button>
          </form>
        )}

        {/* Tab 3: Homepage Bottom CTA Footer */}
        {activeTab === 'cta' && (
          <form onSubmit={handleSaveHomeConfig} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Homepage Bottom CTA Section</h2>
              <p className="text-xs text-gray-500 mt-1">Configure the large call-to-action banner shown at the bottom of the public homepage.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">CTA Headline</label>
                <input 
                  type="text" 
                  required
                  value={homeConfig.cta.headline}
                  onChange={(e) => updateCtaField('headline', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">CTA Description</label>
                <textarea 
                  rows={3}
                  required
                  value={homeConfig.cta.description}
                  onChange={(e) => updateCtaField('description', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                ></textarea>
              </div>

              <div className="w-1/2">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Button Text</label>
                <input 
                  type="text" 
                  required
                  value={homeConfig.cta.buttonText}
                  onChange={(e) => updateCtaField('buttonText', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-orange-500 text-black px-6 py-3 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" /> Save CTA Footer settings
            </button>
          </form>
        )}

        {/* Tab 4: Custom Services List */}
        {activeTab === 'custom_services' && (
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Manage General Services list</h2>
              <p className="text-xs text-gray-500 mt-1">Customize the list of studio services displayed on the public /services page.</p>
            </div>
            
            {/* List Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customServices.map((service) => (
                <div key={service.id} className="bg-black border border-white/5 p-4 rounded-sm flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">{service.title}</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{service.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteCustomService(service.id)}
                    className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-red-500 transition-colors ml-4"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Service form */}
            <div className="border-t border-white/5 pt-6">
              <h3 className="font-bold text-white mb-4">Add Custom Studio Service</h3>
              <form onSubmit={handleAddCustomService} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Service Title</label>
                  <input 
                    type="text" 
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="e.g., CGI & Animation"
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Description</label>
                  <input 
                    type="text" 
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="e.g., Post production modeling..."
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-orange-500 text-black px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: Portfolio Gallery */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Manage Portfolio Library</h2>
              <p className="text-xs text-gray-500 mt-1">Configure photo and video assets displayed on the public /portfolio gallery page.</p>
            </div>
            
            {/* Gallery list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {portfolio.map((item) => (
                <div key={item.id} className="bg-black border border-white/5 p-3 rounded-sm flex flex-col justify-between">
                  <div className="aspect-video bg-neutral-900 flex items-center justify-center border border-white/5 rounded-sm mb-3 relative group overflow-hidden">
                    {item.type === 'Photo' ? <Image className="w-8 h-8 text-orange-500/40" /> : <Film className="w-8 h-8 text-orange-500/40" />}
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 bg-orange-500 text-black rounded-full uppercase">{item.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{item.category}</span>
                    <h4 className="text-sm font-bold text-white truncate mt-0.5">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-1">{item.url}</p>
                  </div>
                  <button 
                    onClick={() => handleDeletePortfolio(item.id)}
                    className="w-full bg-neutral-950 text-xs font-semibold text-red-500 hover:bg-red-500/10 py-1.5 rounded-sm transition-colors border border-white/5 mt-3"
                  >
                    Remove Item
                  </button>
                </div>
              ))}
            </div>

            {/* Add Portfolio form */}
            <div className="border-t border-white/5 pt-6">
              <h3 className="font-bold text-white mb-4">Upload Portfolio Item</h3>
              <form onSubmit={handleAddPortfolio} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Item Title</label>
                    <input 
                      type="text" 
                      required
                      value={newPortTitle}
                      onChange={(e) => setNewPortTitle(e.target.value)}
                      placeholder="e.g., Vogue Summer Video"
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Category</label>
                    <select 
                      value={newPortCat}
                      onChange={(e) => setNewPortCat(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Events">Events</option>
                      <option value="Short Film">Short Film</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Type</label>
                    <select 
                      value={newPortType}
                      onChange={(e) => setNewPortType(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Photo">Photo / Image</option>
                      <option value="Video">Video Link</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold font-bold">Asset Link / File URL</label>
                  <input 
                    type="text" 
                    required
                    value={newPortUrl}
                    onChange={(e) => setNewPortUrl(e.target.value)}
                    placeholder="e.g., https://youtube.com/... or /portfolio/vogue.jpg"
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-orange-500 text-black px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Asset to Gallery
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 6: Contact details */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white uppercase">Update Contact Details & Widgets</h2>
              <p className="text-xs text-gray-500 mt-1">Configure company email, office numbers, coordinates, and floating WhatsApp widgets.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Studio Phone</label>
                <input 
                  type="text" 
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Business Email</label>
                <input 
                  type="email" 
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Studio Address</label>
              <input 
                type="text" 
                required
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">WhatsApp Direct Widget Link</label>
              <input 
                type="text" 
                required
                value={whatsAppLink}
                onChange={(e) => setWhatsAppLink(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="text-[10px] text-gray-500 mt-2 block">Link should follow the format `https://wa.me/&lt;number&gt;`</span>
            </div>

            <button 
              type="submit"
              className="bg-orange-500 text-black px-6 py-3 rounded-sm font-bold text-sm uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2 mt-8"
            >
              <Save className="w-4 h-4" /> Save Contact Settings
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
