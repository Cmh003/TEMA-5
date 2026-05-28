import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

import { 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight,
  HiOutlineRefresh,
  HiOutlineBookOpen,
  HiOutlineCollection,
  HiOutlineLightBulb,
  HiOutlineArrowLeft 
} from 'react-icons/hi';

import flashcardsData from '../../data/flashcards.json';

interface Flashcard {
  id: number;
  temaId: number;
  anverso: string;
  reverso: string;
  justificacion?: string; 
}

export default function FlashcardsPage() {
  const navigate = useNavigate();
  
 const auth = useAuth() || { isAuthenticated: false, logout: () => {}, user: null };

const { isAuthenticated, user, logout } = auth;

const userName =
  user?.displayName ||
  user?.email?.split('@')[0] ||
  "Bombero";

const userInitial = userName.charAt(0).toUpperCase();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const plazas = [
    { id: 'operador_c1', title: 'Operador C1 (Orden 1083/2025)' },
    { id: 'tecnico_a2', title: 'Oficial Técnico A2 (Orden 450/2022)' },
    { id: 'conductor_nuevo', title: 'Bombero Esp. Conductor C1 (Nuevo)' }
  ];

  const temario: Record<string, any[]> = {
    operador_c1: [
      {
        blockTitle: 'Temario Completo',
        temas: [
          { id: 101, num: 'T01', title: 'La Función Pública' },
          { id: 102, num: 'T02', title: 'Igualdad' },
          { id: 103, num: 'T03', title: 'PRL y EPI' },
          { id: 104, num: 'T04', title: 'Ley del Fuego' },
        ]
      }
    ],
    conductor_nuevo: [
      {
        blockTitle: 'Temario Oficial Conductor',
        temas: [
          { id: 403, num: 'T01', title: 'La Función Pública' },
          { id: 404, num: 'T02', title: 'Igualdad' },
        ]
      }
    ],
    tecnico_a2: [
      {
        blockTitle: 'Bloque 1',
        temas: [
          { id: 201, num: 'I.1', title: 'Ley 39-2015 P.A.C.' }
        ]
      }
    ]
  };

  const [activePlaza, setActivePlaza] = useState<string>('operador_c1');
  const [temaSeleccionado, setTemaSeleccionado] = useState<number>(101); 
  const [tarjetas, setTarjetas] = useState<Flashcard[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [volteada, setVolteada] = useState(false);

  const currentPlazaData = temario[activePlaza] || [];

  useEffect(() => {
    if (currentPlazaData.length > 0 && currentPlazaData[0].temas.length > 0) {
      setTemaSeleccionado(currentPlazaData[0].temas[0].id);
    }
  }, [activePlaza]);

  useEffect(() => {
    const filtradas = flashcardsData.filter(card => card.temaId === temaSeleccionado);
    setTarjetas(filtradas);
    setIndiceActual(0);
    setVolteada(false);
  }, [temaSeleccionado]);

  const handleSiguiente = () => {
    if (indiceActual < tarjetas.length - 1) {
      setVolteada(false); 
      setTimeout(() => setIndiceActual(prev => prev + 1), 200); 
    }
  };

  const handleAnterior = () => {
    if (indiceActual > 0) {
      setVolteada(false);
      setTimeout(() => setIndiceActual(prev => prev - 1), 200);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black relative overflow-x-hidden">
      
      <header className="w-full border-b border-white/10 bg-[#0A0F1C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img src={imagenLogoBlanco} alt="Yoopo" className="h-8 cursor-pointer hover:opacity-80 transition-opacity hidden md:block" onClick={() => navigate('/')} />
            <button 
              onClick={() => navigate('/estudio')}
              className="flex items-center gap-2 text-white/50 hover:text-[#E1B143] transition font-black uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg"
            >
              <HiOutlineArrowLeft size={16} /> Volver a Estudio
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-black tracking-[0.2em] text-[#E1B143] uppercase hidden lg:block">
              Modo Repaso Rápido
            </span>

            {isAuthenticated && (
              <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#E1B143] font-black">Conectado</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">{userName}</span>
                </div>
                <div 
                  onClick={() => navigate('/perfil')} 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-sm cursor-pointer hover:scale-105 transition-transform"
                >
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-10 lg:py-16 flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">
        
        <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1 pl-2">
              <div className="w-2 h-2 rounded bg-[#E1B143]"></div>
              <h2 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase">1. Oposición</h2>
            </div>
            <div className="flex flex-col gap-2">
              {plazas.map((plaza) => (
                <button
                  key={plaza.id}
                  onClick={() => setActivePlaza(plaza.id)}
                  className={`text-left px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide border ${
                    activePlaza === plaza.id 
                      ? 'bg-[#E1B143] text-black border-[#E1B143] shadow-[0_0_15px_rgba(225,177,67,0.2)]' 
                      : 'bg-[#141B2D] text-white/60 border-white/5 hover:bg-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {plaza.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex items-center gap-2 mb-1 pl-2">
              <HiOutlineBookOpen size={16} className="text-[#E1B143]" />
              <h2 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase">2. Selecciona un Tema</h2>
            </div>
            
            <div className="bg-[#141B2D] border border-white/10 rounded-2xl p-2 md:p-3 shadow-lg flex flex-col gap-1 overflow-y-auto max-h-[300px] lg:max-h-[500px] custom-scrollbar">
              {currentPlazaData.length > 0 ? currentPlazaData.map((bloque, index) => (
                <div key={index} className="flex flex-col gap-1 w-full">
                  <div className="px-3 py-2 text-[10px] font-black tracking-widest text-[#E1B143] uppercase sticky top-0 bg-[#141B2D] z-10 border-b border-white/5">
                    {bloque.blockTitle}
                  </div>
                  {bloque.temas.map((tema: any) => {
                    const isSelected = temaSeleccionado === tema.id;
                    return (
                      <button
                        key={tema.id}
                        onClick={() => setTemaSeleccionado(tema.id)}
                        className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-[#E1B143]/10 border border-[#E1B143]/30 text-white' 
                            : 'bg-transparent border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className={`text-[10px] font-black tracking-widest shrink-0 ${isSelected ? 'text-[#E1B143]' : 'text-white/30'}`}>
                          {tema.num}
                        </span>
                        <span className="text-sm font-medium truncate">{tema.title}</span>
                      </button>
                    );
                  })}
                </div>
              )) : (
                <div className="p-4 text-center text-white/30 text-sm">No hay temas disponibles.</div>
              )}
            </div>
          </div>
        </aside>

        <section className="w-full lg:w-3/4 xl:w-4/5 flex flex-col items-center justify-start lg:pt-4">
          {tarjetas.length === 0 ? (
            <div className="bg-[#141B2D] border border-dashed border-white/20 rounded-3xl w-full h-[400px] flex flex-col items-center justify-center text-center p-8">
              <HiOutlineCollection size={60} className="text-white/20 mb-4" />
              <h3 className="text-xl font-black text-white/60 mb-2">Sin tarjetas</h3>
              <p className="text-white/40 text-sm max-w-sm">No hay flashcards generadas para este tema todavía.</p>
            </div>
          ) : (
            <div className="w-full max-w-[800px] flex flex-col items-center">
              
              <div className="w-full flex justify-between items-center mb-6 px-2">
                <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white/40">
                  Tarjeta <span className="text-white">{indiceActual + 1}</span> <span className="mx-1 text-white/20">/</span> {tarjetas.length}
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[#E1B143] animate-pulse">
                  Haz clic para voltear
                </span>
              </div>

              <div 
                className="relative w-full h-[400px] md:h-[500px] cursor-pointer group"
                style={{ perspective: '1500px' }}
                onClick={() => setVolteada(!volteada)}
              >
                <div 
                  className="w-full h-full relative transition-transform duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem]"
                  style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: volteada ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                  }}
                >
                  
                  <div 
                    className="absolute w-full h-full bg-[#141B2D] border border-white/10 rounded-[2rem] p-8 md:p-14 flex flex-col items-center justify-center text-center group-hover:border-[#E1B143]/30 transition-colors"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute top-8 right-8 text-white/10 group-hover:text-[#E1B143]/30 transition-colors">
                      <HiOutlineRefresh size={32} />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] text-[#E1B143] mb-8 uppercase">Pregunta</span>
                    <h2 className="text-2xl md:text-4xl font-medium leading-relaxed text-white/90">
                      {tarjetas[indiceActual].anverso}
                    </h2>
                  </div>

                  <div 
                    className="absolute w-full h-full bg-gradient-to-br from-[#E1B143] to-[#b88d2d] rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center text-center"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)' 
                    }}
                  >
                    <span className="text-[10px] font-black tracking-[0.2em] text-black/50 mb-6 uppercase">Respuesta</span>
                    
                    <div className="overflow-y-auto custom-scrollbar w-full flex flex-col items-center justify-center gap-8">
                      <h2 className="text-2xl md:text-4xl font-black leading-tight text-black/90 whitespace-pre-wrap">
                        {tarjetas[indiceActual].reverso}
                      </h2>
                      
                      {tarjetas[indiceActual].justificacion && (
                        <div className="bg-black/10 border border-black/10 rounded-2xl p-5 w-full text-left flex gap-4">
                          <HiOutlineLightBulb size={28} className="text-black/60 shrink-0" />
                          <p className="text-base md:text-lg text-black/80 font-medium leading-relaxed">
                            {tarjetas[indiceActual].justificacion}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8 mt-12 w-full justify-between md:justify-center">
                <button 
                  onClick={handleAnterior}
                  disabled={indiceActual === 0}
                  className={`flex-1 md:flex-none p-4 md:px-10 md:py-4 rounded-xl border flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs md:text-sm transition-all ${indiceActual === 0 ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-white/10 bg-[#141B2D] text-white hover:bg-white/10'}`}
                >
                  <HiOutlineChevronLeft size={22} /> <span>Anterior</span>
                </button>
                
                <button 
                  onClick={handleSiguiente}
                  disabled={indiceActual === tarjetas.length - 1}
                  className={`flex-1 md:flex-none p-4 md:px-10 md:py-4 rounded-xl border flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs md:text-sm transition-all ${indiceActual === tarjetas.length - 1 ? 'border-white/5 text-white/20 cursor-not-allowed' : 'border-[#E1B143] bg-[#E1B143] text-black hover:bg-white hover:border-white shadow-[0_0_20px_rgba(225,177,67,0.3)]'}`}
                >
                  <span>Siguiente</span> <HiOutlineChevronRight size={22} />
                </button>
              </div>

            </div>
          )}
        </section>

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