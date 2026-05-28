import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png'; 

import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineMinusCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineRefresh,
  HiOutlineChartPie,
  HiOutlineArrowLeft 
} from 'react-icons/hi';

export default function TestResultados() {
  const location = useLocation();
  const navigate = useNavigate();

  const auth = useAuth() || { isAuthenticated: false, logout: () => {}, user: null };
  const { isAuthenticated, user } = auth;
  const userInitial = user?.name?.charAt(0).toUpperCase() || "E";
  const userName = user?.name || "Emman Ramos";

  useEffect(() => {
    if (!location.state) {
      navigate('/test');
    }
  }, [location, navigate]);

  const stats = location.state || {
    aciertos: 0,
    fallos: 0,
    blancos: 0,
    total: 0,
    tiempoConsumido: 0,
    modo: 'desconocido'
  };

  const penalizacion = stats.fallos * 0.333;
  const notaNeta = Math.max(0, stats.aciertos - penalizacion);
  const notaSobre10 = stats.total > 0 ? (notaNeta / stats.total) * 10 : 0;
  
  const aprobado = notaSobre10 >= 5;

  const formatoTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}m ${segs}s`;
  };

  if (!location.state) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black w-full overflow-x-hidden">
      
      <header className="w-full bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 md:h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <img 
              src={imagenLogoBlanco} 
              alt="Yoopo" 
              className="h-8 cursor-pointer hover:opacity-80 transition-opacity hidden md:block" 
              onClick={() => navigate('/')} 
            />
            <button 
              onClick={() => navigate('/estudio')}
              className="flex items-center gap-2 md:gap-3 text-white/50 hover:text-[#E1B143] transition font-black uppercase text-xs md:text-sm tracking-widest bg-white/5 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl shrink-0"
            >
              <HiOutlineArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Volver a Estudio</span><span className="sm:hidden">Volver</span>
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-2 md:gap-3 text-xs md:text-sm text-white/40 uppercase font-black tracking-widest bg-white/5 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/5">
              <HiOutlineChartPie className="text-amber-400 w-4 h-4 md:w-5 md:h-5" />
              Resultados
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E1B143] font-black">Conectado</span>
                  <span className="text-sm md:text-base font-bold text-white leading-tight">{userName}</span>
                </div>
                <div 
                  onClick={() => navigate('/perfil')} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-sm md:text-base cursor-pointer hover:scale-105 transition-transform shadow-lg shrink-0"
                >
                  {userInitial}
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col items-center justify-start pt-10 md:pt-16 px-6 md:px-12 pb-24">
        <div className="w-full max-w-[800px] flex flex-col gap-6 md:gap-8">

          <div className="w-full bg-[#141B2D]/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-1000 ${aprobado ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

            <h2 className="text-sm md:text-lg font-black tracking-widest text-white/50 uppercase mb-4">
              Calificación Final
            </h2>
            
            <div className="flex items-baseline gap-2 md:gap-4 my-4 relative z-10">
              <span className={`text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${aprobado ? 'from-emerald-300 to-emerald-600' : 'from-red-300 to-red-600'}`}>
                {notaSobre10.toFixed(2)}
              </span>
              <span className="text-3xl md:text-5xl font-bold text-white/20">/10</span>
            </div>

            <div className={`mt-6 px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-black uppercase tracking-widest border backdrop-blur-sm ${aprobado ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]'}`}>
              {aprobado ? '¡Apto!' : 'No Apto'}
            </div>
            
            <p className="mt-10 text-xs md:text-sm text-white/30 max-w-md leading-relaxed">
              * Fórmula aplicada: <span className="text-white/60">Aciertos - (Fallos / 3)</span>. Estimación basada en los criterios oficiales de corrección.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6">
            
            <div className="bg-[#141B2D]/60 border border-white/5 hover:border-emerald-500/30 transition-colors rounded-[2rem] p-6 md:p-8 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HiOutlineCheckCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
              </div>
              <span className="text-3xl md:text-5xl font-black text-white mb-2">{stats.aciertos}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/40">Aciertos</span>
            </div>

            <div className="bg-[#141B2D]/60 border border-white/5 hover:border-red-500/30 transition-colors rounded-[2rem] p-6 md:p-8 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HiOutlineXCircle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
              </div>
              <span className="text-3xl md:text-5xl font-black text-white mb-2">{stats.fallos}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/40">Fallos</span>
            </div>

            <div className="bg-[#141B2D]/60 border border-white/5 hover:border-white/20 transition-colors rounded-[2rem] p-6 md:p-8 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HiOutlineMinusCircle className="w-8 h-8 md:w-10 md:h-10 text-white/40" />
              </div>
              <span className="text-3xl md:text-5xl font-black text-white mb-2">{stats.blancos}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/40">Blancos</span>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <div className="flex-1 bg-[#141B2D]/40 border border-white/5 rounded-[2rem] p-6 md:p-8 flex items-center gap-5 md:gap-6">
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-[#E1B143]/10 flex items-center justify-center text-[#E1B143]">
                <HiOutlineClock className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white/40">Tiempo total</span>
                <span className="text-xl md:text-2xl font-bold text-white/90">{formatoTiempo(stats.tiempoConsumido)}</span>
              </div>
            </div>

            <div className="flex-1 bg-[#141B2D]/40 border border-white/5 rounded-[2rem] p-6 md:p-8 flex items-center gap-5 md:gap-6">
              <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <HiOutlineChartBar className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white/40">Modalidad</span>
                <span className="text-xl md:text-2xl font-bold text-white/90 capitalize">{stats.modo}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-5 md:gap-6 w-full">
            <button 
              onClick={() => navigate('/test')}
              className="flex-1 py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-sm md:text-base flex items-center justify-center gap-4 bg-[#E1B143] text-black hover:bg-white hover:shadow-[0_0_25px_rgba(225,177,67,0.4)] transition-all hover:-translate-y-1"
            >
              <HiOutlineRefresh className="w-6 h-6 md:w-7 md:h-7" /> Nuevo Test
            </button>
            <button 
              onClick={() => navigate('/perfil')} 
              className="flex-1 py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-sm md:text-base flex items-center justify-center gap-4 bg-[#141B2D] border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1"
            >
              <HiOutlineChartPie className="w-6 h-6 md:w-7 md:h-7" /> Ver Estadísticas
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}