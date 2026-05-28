import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePomodoro, tiempos } from '../context/PomodoroContext';
import { HiOutlinePlay, HiOutlinePause, HiOutlineFire } from 'react-icons/hi';

export default function FloatingPomodoro() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tiempoRestante, activo, toggleTemporizador, modo } = usePomodoro();

  if (location.pathname === '/pomodoro') return null;
  if (!activo && tiempoRestante === tiempos[modo]) return null;

  const minutos = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
  const segundos = (tiempoRestante % 60).toString().padStart(2, '0');
  const porcentaje = (tiempoRestante / tiempos[modo]) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4 bg-[#0A0F1C]/90 backdrop-blur-2xl border border-white/10 p-2 pr-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-[fadeIn_0.4s_ease-out] hover:scale-105 transition-transform duration-300 group">
      
      
      <button 
        onClick={(e) => { e.stopPropagation(); toggleTemporizador(); }}
        className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${activo ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-gradient-to-tr from-[#E1B143] to-[#F2D06B] text-black shadow-[0_0_15px_rgba(225,177,67,0.3)] hover:shadow-[0_0_25px_rgba(225,177,67,0.5)]'}`}
      >
        {activo ? <HiOutlinePause size={20} /> : <HiOutlinePlay size={20} className="ml-1" />}
      </button>

     
      <div 
        className="flex flex-col cursor-pointer min-w-[70px]"
        onClick={() => navigate('/pomodoro')}
      >
        <div className="flex items-center gap-2 mb-1">
          <HiOutlineFire className={`transition-colors ${activo ? 'text-[#E1B143] animate-pulse' : 'text-white/30'}`} size={16} />
          <span className={`font-mono text-sm md:text-base font-black tracking-widest transition-colors ${tiempoRestante < 60 ? 'text-red-400 animate-pulse' : 'text-white/90'}`}>
            {minutos}:{segundos}
          </span>
        </div>
        
       
        <div className="w-full h-1.5 bg-[#141B2D] rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-200 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.8)]"
            style={{ width: `${100 - porcentaje}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
}