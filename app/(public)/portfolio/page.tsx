import { Play } from 'lucide-react';

export default function PortfolioPage() {
  const portfolioItems = [
    {
      title: "Urban Architecture",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      title: "Fashion Editorial",
      category: "Video",
      image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
    },
    {
      title: "Automotive Commercial",
      category: "Video",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
    },
    {
      title: "Product Campaign",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 md:col-span-3 row-span-1",
    },
    {
      title: "Corporate Documentary",
      category: "Video",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      title: "Lifestyle Portraits",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
      span: "col-span-1 row-span-1",
    }
  ];

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Our <span className="text-orange-500">Work</span></h1>
          <p className="text-gray-400 max-w-xl">A curated selection of our finest photography and videography projects.</p>
        </div>
        <div className="flex gap-4 mt-8 md:mt-0">
          <button className="text-white hover:text-orange-500 font-bold uppercase tracking-widest text-sm transition-colors border-b-2 border-orange-500 pb-1">All</button>
          <button className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors pb-1">Photography</button>
          <button className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors pb-1">Video</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-4">
        {portfolioItems.map((item, index) => (
          <div key={index} className={`group relative overflow-hidden rounded-sm bg-neutral-900 ${item.span}`}>
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-80 transition-opacity" />
            
            {item.category === 'Video' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2 block">{item.category}</span>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
