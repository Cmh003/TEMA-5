import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
   
    const consent = localStorage.getItem('yoopo_cookie_consent');
    if (!consent) {
     
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('yoopo_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('yoopo_cookie_consent', 'declined');
    setIsVisible(false);
   
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-[9999] flex justify-center pointer-events-none"
        >
          <div className="bg-[#1A233A]/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
            
            <div className="text-left flex-1">
              <h3 className="text-[#E1B143] font-black uppercase tracking-widest text-xs mb-2">Privacidad y Cookies</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Utilizamos cookies técnicas estrictamente necesarias para mantener tu sesión abierta y asegurar el correcto funcionamiento de la plataforma. Puedes elegir aceptarlas todas o rechazar las no esenciales. 
                <a href="#" className="text-white underline ml-1 hover:text-[#E1B143] transition-colors">Leer Política</a>.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={handleDecline}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all cursor-pointer"
              >
                Rechazar
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-[#E1B143] text-[#131a2c] text-xs font-black uppercase tracking-widest hover:scale-105 hover:bg-amber-400 shadow-[0_0_20px_rgba(225,177,67,0.3)] transition-all cursor-pointer"
              >
                Aceptar Cookies
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}