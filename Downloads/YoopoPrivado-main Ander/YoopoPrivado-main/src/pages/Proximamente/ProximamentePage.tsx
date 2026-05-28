import Navbar from '../../components/Navbar';

export default function ProximamentePage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0A0F1C] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          
          <span className="text-[#E1B143] uppercase tracking-[0.3em] font-black text-sm">
            Yoopo
          </span>

          <h1 className="text-5xl md:text-7xl font-black mt-6 mb-6 uppercase italic">
            Próximamente
          </h1>

          <p className="text-white/50 text-lg md:text-xl leading-relaxed">
            Estamos trabajando en nuevas funcionalidades para mejorar la experiencia de preparación.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 bg-[#1A233A] border border-white/10 px-8 py-4 rounded-2xl">
            <div className="w-3 h-3 rounded-full bg-[#E1B143] animate-pulse"></div>
            <span className="font-bold text-white/70">
              En desarrollo
            </span>
          </div>

        </div>
      </div>
    </>
  );
}