// src/context/PomodoroContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePause, HiOutlinePlay, HiOutlineX } from 'react-icons/hi';
import { useAuth } from './AuthContext'; // <-- 1. AÑADIMOS AUTH AQUI

const PomodoroContext = createContext();

export const tiempos = {
  estudio: 25 * 60,
  descansoCorto: 5 * 60,
  descansoLargo: 15 * 60
};

export function PomodoroProvider({ children }) {
  // 2. CONECTAMOS CON LA SESIÓN DEL USUARIO
  const auth = useAuth() || { isAuthenticated: false };
  const { isAuthenticated } = auth;

  // 3. INICIALIZACIÓN SEGURA DESDE LOCALSTORAGE
  const [modo, setModo] = useState(() => localStorage.getItem('pom_modo') || "estudio");
  
  const [tiempoRestante, setTiempoRestante] = useState(() => {
    const guardado = localStorage.getItem('pom_tiempo');
    if (guardado) {
      const val = parseInt(guardado, 10);
      return isNaN(val) ? tiempos.estudio : val; 
    }
    return tiempos.estudio;
  });
  
  const [activo, setActivo] = useState(() => localStorage.getItem('pom_activo') === 'true');
  const [miniTimerClosed, setMiniTimerClosed] = useState(false);
  const [isPomodoroPage, setIsPomodoroPage] = useState(false);

  const intervaloRef = useRef(null);

  // =======================================================
  // 💀 KILL SWITCH: MATAR EL TIMER CUANDO CIERRES SESIÓN
  // =======================================================
  useEffect(() => {
    if (!isAuthenticated) {
      clearInterval(intervaloRef.current);
      setActivo(false);
      setModo("estudio");
      setTiempoRestante(tiempos.estudio);
      setMiniTimerClosed(false);
      
      localStorage.removeItem('pom_modo');
      localStorage.removeItem('pom_tiempo');
      localStorage.removeItem('pom_activo');
    }
  }, [isAuthenticated]);

  // 4. CHECK SEGURO DE PÁGINA
  useEffect(() => {
    const checkPath = () => {
      setIsPomodoroPage(window.location.pathname === '/pomodoro');
    };
    checkPath();
    const pathInterval = setInterval(checkPath, 500);
    return () => clearInterval(pathInterval);
  }, []);

  // 5. GUARDADO EN TIEMPO REAL (Solo si estamos logueados)
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('pom_modo', modo);
      localStorage.setItem('pom_tiempo', tiempoRestante.toString());
      localStorage.setItem('pom_activo', activo.toString());
    }
  }, [modo, tiempoRestante, activo, isAuthenticated]);

  // ⏱ TIMER ROBUSTO
  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(intervaloRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervaloRef.current);
    }
    return () => clearInterval(intervaloRef.current);
  }, [activo]);

  // 🔚 cuando termina
  useEffect(() => {
    if (tiempoRestante === 0) {
      setActivo(false);
    }
  }, [tiempoRestante]);

  const toggleTemporizador = () => {
    setActivo((prev) => !prev);
    setMiniTimerClosed(false); 
  };

  const reiniciarTemporizador = () => {
    clearInterval(intervaloRef.current);
    const originalTime = tiempos[modo];
    setTiempoRestante(originalTime);
    setActivo(false);
    setMiniTimerClosed(false);
    // 🔥 PRO FIX: Forzamos el guardado en memoria instantáneamente
    localStorage.setItem('pom_tiempo', originalTime.toString());
  };

  const cambiarModo = (nuevoModo) => {
    clearInterval(intervaloRef.current);
    setModo(nuevoModo);
    const nuevoTiempo = tiempos[nuevoModo];
    setTiempoRestante(nuevoTiempo);
    setActivo(false);
    setMiniTimerClosed(false);
    // 🔥 PRO FIX: Sobrescribimos el localStorage para erradicar el glitch de 5 min
    localStorage.setItem('pom_modo', nuevoModo);
    localStorage.setItem('pom_tiempo', nuevoTiempo.toString());
    localStorage.setItem('pom_activo', 'false');
  };

  // Lógica visual del widget flotante
  const showMiniTimer = activo && !isPomodoroPage && !miniTimerClosed && isAuthenticated;
  const minutos = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
  const segundos = (tiempoRestante % 60).toString().padStart(2, '0');
  const porcentaje = (tiempoRestante / tiempos[modo]) * 100;

  return (
    <PomodoroContext.Provider
      value={{
        modo,
        tiempoRestante,
        activo,
        cambiarModo,
        toggleTemporizador,
        reiniciarTemporizador
      }}
    >
      {children}

      {/* ======================================================= */}
      {/* WIDGET FLOTANTE NOTIFICATION MODE                         */}
      {/* ======================================================= */}
      <AnimatePresence>
        {showMiniTimer && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-8 z-[9999] bg-[#0A0F1C]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 pr-4 flex items-center gap-4 cursor-pointer hover:border-[#E1B143]/50 transition-colors"
            onClick={() => window.location.href = '/pomodoro'} 
          >
            {/* Botón Pause/Play */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleTemporizador(); 
              }}
              className="w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              {activo ? <HiOutlinePause size={24} /> : <HiOutlinePlay size={24} className="ml-1" />}
            </button>

            {/* Info Timer */}
            <div className="flex flex-col min-w-[70px]">
              <div className="flex items-center gap-2 text-white font-black text-xl tracking-widest tabular-nums leading-none mt-1">
                <span className="text-[#E1B143] opacity-80 text-lg">🔥</span> {minutos}:{segundos}
              </div>
              <div className="w-full h-1.5 bg-[#141B2D] rounded-full mt-1.5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-900 to-blue-500 transition-all duration-1000"
                  style={{ width: `${100 - porcentaje}%` }}
                />
              </div>
            </div>

            {/* Botón X para cerrar */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setMiniTimerClosed(true); 
              }}
              className="w-6 h-6 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors ml-2"
              title="Ocultar widget"
            >
              <HiOutlineX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}