export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-6xl">
      <h1 className="text-5xl font-bold text-white mb-8">About <span className="text-orange-500">Us</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            FORG Studio is more than just a production company. We are a collective of passionate storytellers, visual artists, and technical experts dedicated to bringing your vision to life.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            With over a decade of experience in high-end commercial photography and cinematic videography, we've built a reputation for delivering exceptional quality and unmatched creativity. Every frame we capture is meticulously crafted to tell a compelling story.
          </p>
        </div>
        <div className="bg-neutral-900 aspect-square md:aspect-[4/3] relative rounded-sm overflow-hidden">
            <img src="https://images.unsplash.com/photo-1590650153855-8b2659d4d509?q=80&w=1000&auto=format&fit=crop" alt="Team at work" className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
}
