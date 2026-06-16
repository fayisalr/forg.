import { Camera, Film, MonitorPlay, Sparkles } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: "Commercial Photography",
      description: "High-end product, lifestyle, and editorial photography that elevates your brand and captures your audience's attention.",
      icon: <Camera className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Cinematic Videography",
      description: "Compelling brand films, commercials, and documentaries shot on cinema cameras with premium lighting and sound.",
      icon: <Film className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Post-Production",
      description: "Meticulous color grading, editing, and sound design to bring the final polish to your visual assets.",
      icon: <MonitorPlay className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Creative Direction",
      description: "From concept to execution, we help shape the visual identity of your campaigns with innovative ideas.",
      icon: <Sparkles className="w-8 h-8 text-orange-500" />
    }
  ];

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold text-white mb-6">Our <span className="text-orange-500">Services</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Comprehensive media production services tailored for brands that demand excellence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-neutral-900 border border-white/5 p-10 rounded-sm hover:border-orange-500/50 transition-colors group">
            <div className="bg-black w-16 h-16 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
            <p className="text-gray-400 leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
