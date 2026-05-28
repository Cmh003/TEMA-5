import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png'; 
import { usePomodoro, tiempos } from '../../context/PomodoroContext'; 
import { useAuth } from '../../context/AuthContext'; 

import gifBomberoTrabajando from '../../assets/gifs/bombero-trabajando.gif'; 
import gifBomberoFin from '../../assets/gifs/bombero-fin.gif'; 

import { 
  HiOutlinePlay, 
  HiOutlinePause, 
  HiOutlineRefresh,
  HiOutlineFire,
  HiOutlineSparkles,
  HiOutlineArrowLeft
} from 'react-icons/hi';

export default function PomodoroPage() {
  const navigate = useNavigate();

  const auth = useAuth() || { isAuthenticated: false, logout: () => {}, user: null };
  const { isAuthenticated, user } = auth;
  const userName =
  user?.displayName ||
  user?.email?.split('@')[0] ||
  "Bombero";

const userInitial = userName.charAt(0).toUpperCase();

  const { 
    modo, 
    tiempoRestante, 
    activo, 
    cambiarModo, 
    toggleTemporizador, 
    reiniciarTemporizador 
  } = usePomodoro();

  const [imgErrorTrabajando, setImgErrorTrabajando] = useState(false);
  const [imgErrorFin, setImgErrorFin] = useState(false);

  const minutos = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
  const segundos = (tiempoRestante % 60).toString().padStart(2, '0');

  const tiempoTotal = tiempos[modo as keyof typeof tiempos];
  const porcentaje = ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100;
  const porcentajeInverso = tiempoRestante / tiempoTotal;
  const objetivoCumplido = tiempoRestante === 0;

  const themes: any = {
    estudio: {
      gradient: "from-amber-400 to-yellow-500",
      glow: "bg-amber-400",
      label: "Tiempo de foco",
      status: "Sofocando llamas...",
      targetIcon: "🔥",
      successText: "¡Incendio Extinguido!"
    },
    descansoCorto: {
      gradient: "from-cyan-400 to-blue-500",
      glow: "bg-cyan-400",
      label: "Retén (Descanso)",
      status: "Reponiendo fuerzas...",
      targetIcon: "🔥",
      successText: "¡Descanso Completado!"
    },
    descansoLargo: {
      gradient: "from-indigo-500 to-purple-600",
      glow: "bg-indigo-500",
      label: "Base (Descanso Largo)",
      status: "En la base de operaciones...",
      targetIcon: "🏠",
      successText: "¡Energía al máximo!"
    }
  };

  const currentTheme = themes[modo];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black relative overflow-x-hidden">

      <header className="border-b border-white/5 bg-[#0A0F1C]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center text-white">
          <div className="flex items-center gap-8">
            <img 
              src={imagenLogoBlanco} 
              alt="Yoopo"
              className="h-8 cursor-pointer opacity-80 hover:opacity-100 transition-opacity hidden md:block"
              onClick={() => navigate('/')}
            />
            <button 
              onClick={() => navigate('/estudio')}
              className="flex items-center gap-2 text-white/50 hover:text-[#E1B143] transition font-black uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg"
            >
              <HiOutlineArrowLeft size={16} /> Volver a Estudio
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-white/40 uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <HiOutlineFire className="text-[#E1B143]" />
              Central de Emergencias
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#E1B143] font-black">Conectado</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">{userName}</span>
                </div>
                <div onClick={() => navigate('/perfil')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-sm cursor-pointer hover:scale-105 transition-transform">
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 md:px-12 lg:px-20 py-12 lg:py-20">
        <div className="w-full max-w-[1000px] bg-[#141B2D]/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">

          <div className={`absolute inset-0 opacity-10 blur-[100px] pointer-events-none ${currentTheme.glow}`} />

          <div className="relative z-50 flex bg-[#0A0F1C]/80 rounded-full p-2 mb-12 md:mb-16 border border-white/5 shadow-inner">
            {["estudio","descansoCorto","descansoLargo"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  if (modo !== m) {
                    cambiarModo(m);
                  }
                }}
                className={`flex-1 py-3 md:py-4 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.15em] transition-all duration-300 relative z-[60]
                  ${modo === m 
                    ? `bg-gradient-to-r ${themes[m].gradient} text-black scale-105 shadow-lg`
                    : 'text-white/40 hover:text-white hover:bg-white/5'}
                `}
              >
                {m === "estudio" && "Extinción (25')"}
                {m === "descansoCorto" && "Retén (5')"}
                {m === "descansoLargo" && "Base (15')"}
              </button>
            ))}
          </div>

          <div className="text-center mb-12 md:mb-16 relative z-10 flex flex-col items-center">
            <h1 className="text-[6rem] sm:text-[9rem] md:text-[12rem] lg:text-[14rem] font-black tabular-nums leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] pr-4 md:pr-8">
              {minutos}:{segundos}
            </h1>
            <p className="text-white/20 uppercase text-xs md:text-base font-black tracking-[0.4em] mt-6 md:mt-8">
              {currentTheme.label}
            </p>
          </div>

          <div className="w-full relative h-32 md:h-48 mb-12 bg-[#0A0F1C]/80 rounded-[2rem] border border-white/10 overflow-hidden z-10 shadow-inner pointer-events-none">
            <motion.div 
              className="absolute top-0 bottom-0 flex items-center z-30"
              animate={{ left: `${porcentaje * 0.75}%` }} 
              transition={{ duration: 0.5, ease: "linear" }}
            >
              <div className="w-24 md:w-40 h-24 md:h-40 flex items-center justify-center shrink-0 relative">
                {!objetivoCumplido ? (
                  !imgErrorTrabajando ? (
                    <img 
                      src={gifBomberoTrabajando} 
                      alt="Bombero"
                      className="w-full h-full object-contain transform -scale-x-100 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" 
                      onError={() => setImgErrorTrabajando(true)} 
                    />
                  ) : (
                    <span className="text-5xl md:text-7xl">🧑‍🚒</span>
                  )
                ) : (
                  !imgErrorFin ? (
                    <img src={gifBomberoFin} alt="Fin" className="w-full h-full object-contain" onError={() => setImgErrorFin(true)} />
                  ) : (
                    <span className="text-5xl md:text-7xl">🏆</span>
                  )
                )}
              </div>
            </motion.div>

            <div className="absolute right-6 md:right-12 top-0 bottom-0 flex items-center z-20">
              {!objetivoCumplido ? (
                <motion.div
                  className="text-6xl md:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  animate={modo === 'estudio' ? {
                    scale: 0.5 + (porcentajeInverso * 0.7),
                    opacity: 0.4 + (porcentajeInverso * 0.6)
                  } : { scale: [1, 1.05, 1] }}
                  transition={modo !== 'estudio' ? { repeat: Infinity, duration: 2 } : {}}
                >
                  {currentTheme.targetIcon}
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl md:text-7xl">✅</motion.div>
              )}
            </div>
          </div>

          <div className="w-full h-2 md:h-3 bg-white/5 rounded-full overflow-hidden mb-12 relative z-10">
            <motion.div
              className={`h-full bg-gradient-to-r ${currentTheme.gradient} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </div>

          <div className="text-center mb-12 h-6 md:h-8 relative z-10">
            {objetivoCumplido ? (
              <motion.span className="text-emerald-400 font-black uppercase tracking-widest text-sm md:text-base flex justify-center items-center gap-3">
                <HiOutlineSparkles className="animate-pulse" size={20} /> {currentTheme.successText} <HiOutlineSparkles className="animate-pulse" size={20} />
              </motion.span>
            ) : (
              <span className="text-white/40 text-xs md:text-base font-bold uppercase tracking-[0.2em]">
                {activo ? currentTheme.status : 'Esperando orden de salida...'}
              </span>
            )}
          </div>

          <div className="flex justify-center gap-8 md:gap-12 relative z-[100]">
            <button
              onClick={toggleTemporizador}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl md:text-5xl transition-all duration-300 shadow-2xl active:scale-90
                ${activo 
                  ? 'bg-[#0A0F1C] border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white'
                  : `bg-gradient-to-r ${currentTheme.gradient} text-black hover:scale-105`}
              `}
            >
              {activo ? <HiOutlinePause /> : <HiOutlinePlay className="ml-2" />}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                reiniciarTemporizador();
              }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 group cursor-pointer"
              title="Reiniciar"
            >
              <HiOutlineRefresh className="text-2xl md:text-3xl group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

        </div>
      </main>

      <footer className="w-full bg-[#050810] text-white/30 pt-16 pb-10 border-t border-white/5 mt-auto">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src={imagenLogoBlanco} alt="Logo" className="h-10 mb-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate('/')} />
            <p className="text-sm max-w-xs leading-relaxed font-medium">Democratizando el acceso a la preparación integral para opositores a bomberos de élite.</p>
          </div>
          {[{title:'Recursos', links:['Temario','Test Gratis', 'Calculadora Hidráulica']},{title:'Compañía', links:['Sobre Nosotros','Contacto', 'Comunidad']},{title:'Legal', links:['Privacidad','Términos de Uso', 'Cookies']}].map(col => (
            <div key={col.title}>
              <h3 className="text-[#E1B143] font-black mb-6 uppercase text-xs tracking-[0.2em]">{col.title}</h3>
              <ul className="space-y-3 text-sm font-medium">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] tracking-[0.5em] opacity-30 font-black uppercase">
          © {new Date().getFullYear()} YOOPO. Forjando el éxito.
        </div>
      </footer>
      
    </div>
  );
}