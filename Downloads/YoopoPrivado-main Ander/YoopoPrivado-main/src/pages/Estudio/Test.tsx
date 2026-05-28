import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

import { 
  HiOutlineAdjustments,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlineArrowLeft
} from 'react-icons/hi';

export default function TestPage() {
  const navigate = useNavigate();
  
  const auth = useAuth() || { isAuthenticated: false, logout: () => {}, user: null };
  const { isAuthenticated, user } = auth;
 const userName =
  user?.displayName ||
  user?.email?.split('@')[0] ||
  "Bombero";

const userInitial = userName.charAt(0).toUpperCase();
  
  const [activeBlock, setActiveBlock] = useState<string>('operador_c1'); 
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});
  
  const [selectedTemas, setSelectedTemas] = useState<number[]>([]); 
  const [numPreguntas, setNumPreguntas] = useState<number>(30);
  const [testMode, setTestMode] = useState<string>('entrenamiento'); 

  const plazas = [
    { id: 'operador_c1', title: 'Operador C1 (Orden 1083/2025)' },
    { id: 'tecnico_a2', title: 'Oficial Técnico A2 (Orden 450/2022)' },
    { id: 'conductor_2023', title: 'Bombero Especialista Conductor C1 (Orden 2780/2023)' },
    { id: 'conductor_nuevo', title: 'Bombero Esp. Conductor C1 (Nuevo actualizado)' }
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
          { id: 105, num: 'T05', title: 'SNPC' },
          { id: 106, num: 'T06', title: 'Territorio y Red de infraestructuras de la CM' },
          { id: 107, num: 'T07', title: 'Organización del CBCM' },
          { id: 108, num: 'T08', title: 'Documento organización CECOP' },
          { id: 109, num: 'T09', title: 'Anexo I funcionamiento de la sala v3.0' },
          { id: 110, num: 'T10', title: 'IT.0141_TIPIFICACION de servicios CBCM' },
          { id: 111, num: 'T11', title: 'PT.0137_Procedimiento CERO Activación' },
          { id: 112, num: 'T12', title: 'Procedimiento ACTIVACIÓN tentativa de suicidio' },
          { id: 113, num: 'T13', title: 'Procedimiento ACTIVACION entorno acuático' },
          { id: 114, num: 'T14', title: 'PT.0117_Procedimiento Activacion Incendio Vegetacion' },
          { id: 115, num: 'T15', title: 'Procedimiento Gestión de la Guardia INFOMA' },
          { id: 116, num: 'T16', title: 'PT.0151_Comunicaciones en Emergencias' },
          { id: 117, num: 'T17', title: 'Comunicaciones en el Servicio de Bomberos' },
          { id: 118, num: 'T18', title: 'Fundamentos de la informática' },
          { id: 119, num: 'T19', title: 'SVB I' },
          { id: 120, num: 'T20', title: 'SVB II' },
        ]
      }
    ],
    conductor_nuevo: [
      {
        blockTitle: 'Temario Oficial Conductor',
        temas: [
          { id: 401, num: '00', title: 'Correcciones 2026' },
          { id: 402, num: '00', title: 'Introducción y epígrafes' },
          { id: 403, num: 'T01', title: 'La Funcion Publica' },
          { id: 404, num: 'T02', title: 'Igualdad' },
          { id: 405, num: 'T03', title: 'PRL y EPI' },
          { id: 406, num: 'T04', title: 'DL 1 2006' },
          { id: 407, num: 'T05', title: 'SNPC' },
        ]
      }
    ],
    tecnico_a2: [
      {
        blockTitle: 'Bloque 1',
        temas: [
          { id: 201, num: 'I.1', title: 'Ley 39-2015 P.A.C. de las AA.PP (Parte 1)' },
          { id: 202, num: 'I.2', title: 'Ley 39-2015 P.A.C. de las AA.PP (Parte 2)' },
        ]
      }
    ]
  };

  const currentPlazaData = temario[activeBlock] || [];

  useEffect(() => {
    setSelectedTemas([]);
    if (currentPlazaData.length > 0) {
      setOpenBlocks({ [currentPlazaData[0].blockTitle]: true });
    } else {
      setOpenBlocks({});
    }
  }, [activeBlock]);

  const toggleBlock = (title: string) => {
    setOpenBlocks(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleTemaToggle = (temaId: number) => {
    setSelectedTemas(prev => 
      prev.includes(temaId) 
        ? prev.filter(id => id !== temaId) 
        : [...prev, temaId]
    );
  };

  const handleSelectAllBlock = (bloqueTemas: any[]) => {
    const bloqueIds = bloqueTemas.map((t: any) => t.id);
    const allSelected = bloqueIds.length > 0 && bloqueIds.every((id: number) => selectedTemas.includes(id));
    
    if (allSelected) {
      setSelectedTemas(prev => prev.filter(id => !bloqueIds.includes(id)));
    } else {
      setSelectedTemas(prev => Array.from(new Set([...prev, ...bloqueIds])));
    }
  };

  const handleStartTest = () => {
    if (selectedTemas.length === 0) {
      alert("Por favor, selecciona al menos un tema para generar el test.");
      return;
    }
    
    navigate('/test/ejecucion', { 
      state: { 
        temasSeleccionados: selectedTemas, 
        cantidadPreguntas: numPreguntas, 
        modo: testMode 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black relative overflow-x-hidden">
      
      <header className="w-full border-b border-white/10 bg-[#0A0F1C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img 
              src={imagenLogoBlanco} 
              alt="Yoopo" 
              className="h-8 cursor-pointer hover:opacity-80 transition-opacity hidden md:block" 
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
              <HiOutlineAdjustments className="text-amber-400" />
              Centro de Evaluación
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#E1B143] font-black">Conectado</span>
                  <span className="text-sm font-bold text-white leading-tight">{userName}</span>
                </div>
                <div 
                  onClick={() => navigate('/perfil')} 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-10 lg:py-16 flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-20">
        
        <aside className="w-full lg:w-1/3 xl:w-1/4 shrink-0 flex flex-col gap-8">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2 pl-2">
              <div className="w-2 h-2 rounded bg-[#E1B143] animate-pulse"></div>
              <h2 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase">1. Elige tu Oposición</h2>
            </div>
            {plazas.map((plaza) => (
              <button
                key={plaza.id}
                onClick={() => setActiveBlock(plaza.id)}
                className={`text-left px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide border break-words ${
                  activeBlock === plaza.id 
                    ? 'bg-[#E1B143] text-black border-[#E1B143] shadow-[0_0_20px_rgba(225,177,67,0.2)]' 
                    : 'bg-[#141B2D] text-white/60 border-white/5 hover:bg-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {plaza.title}
              </button>
            ))}
          </div>

          <div className="bg-[#141B2D] border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col gap-8 sticky top-28 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <HiOutlineAdjustments size={28} className="text-[#E1B143]" />
              <h2 className="text-xl lg:text-2xl font-black uppercase italic tracking-tight text-white">Configurar Test</h2>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-black text-white/50 tracking-widest uppercase">Número de preguntas</label>
              <div className="grid grid-cols-4 gap-2 lg:gap-3">
                {[10, 30, 50, 100].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setNumPreguntas(num)}
                    className={`py-3 rounded-xl text-sm lg:text-base font-bold transition-all border ${numPreguntas === num ? 'bg-[#E1B143]/20 border-[#E1B143] text-[#E1B143]' : 'bg-black/30 border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-black text-white/50 tracking-widest uppercase">Modo de ejecución</label>
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                <button onClick={() => setTestMode('entrenamiento')} className={`py-4 px-2 rounded-xl text-[10px] lg:text-xs font-black tracking-widest uppercase transition-all border flex flex-col items-center text-center gap-2 break-words ${testMode === 'entrenamiento' ? 'bg-[#E1B143]/20 border-[#E1B143] text-[#E1B143]' : 'bg-black/30 border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}>
                  <HiOutlineBookOpen size={22} /> Entrenamiento
                </button>
                <button onClick={() => setTestMode('examen')} className={`py-4 px-2 rounded-xl text-[10px] lg:text-xs font-black tracking-widest uppercase transition-all border flex flex-col items-center text-center gap-2 break-words ${testMode === 'examen' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/30 border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}>
                  <HiOutlineClock size={22} /> Examen Real
                </button>
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-6">
              <div className="flex justify-between items-center text-sm lg:text-base font-medium text-white/70">
                <span>Temas seleccionados:</span>
                <span className="text-[#E1B143] font-black text-xl lg:text-2xl">{selectedTemas.length}</span>
              </div>
              <button 
                onClick={handleStartTest}
                disabled={selectedTemas.length === 0}
                className={`py-5 rounded-xl text-sm lg:text-base font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${selectedTemas.length > 0 ? 'bg-[#E1B143] text-black hover:shadow-[0_0_20px_rgba(225,177,67,0.4)] hover:-translate-y-1' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
              >
                <HiOutlinePlay size={24} /> Generar Test
              </button>
            </div>
          </div>

        </aside>

        <section className="w-full lg:w-2/3 xl:w-3/4 flex flex-col overflow-hidden">
          
          <div className="flex flex-col mb-10 pb-4">
             <div className="flex items-center gap-2 mb-3 pl-1">
              <h2 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase">2. Selecciona los temas a evaluar</h2>
             </div>
             <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white mb-2 drop-shadow-md">
               {plazas.find(p => p.id === activeBlock)?.title}
             </h1>
          </div>

          <div className="flex flex-col gap-6 mb-20 w-full">
            {currentPlazaData.length > 0 ? currentPlazaData.map((bloque, index) => {
              const isOpen = openBlocks[bloque.blockTitle];
              const bloqueIds = bloque.temas.map((t: any) => t.id);
              const allSelected = bloqueIds.length > 0 && bloqueIds.every((id: number) => selectedTemas.includes(id));
              
              return (
                <div key={index} className={`bg-[#141B2D] border rounded-2xl overflow-hidden transition-all duration-500 w-full ${isOpen ? 'border-[#E1B143]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/5'}`}>
                  
                  <div className={`px-6 md:px-8 py-6 flex justify-between items-center transition-colors w-full ${isOpen ? 'bg-gradient-to-r from-[#1a233a] to-[#141B2D]' : 'hover:bg-white/5'}`}>
                    
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSelectAllBlock(bloque.temas); }}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border transition-all shrink-0 ${allSelected ? 'bg-[#E1B143] border-[#E1B143] text-black' : 'bg-black/50 border-white/20 hover:border-[#E1B143]/50'}`}
                      >
                        {allSelected && <HiOutlineCheckCircle size={24} />}
                      </button>

                      <div onClick={() => toggleBlock(bloque.blockTitle)} className="cursor-pointer flex items-center gap-4 overflow-hidden">
                        <h3 className={`text-xl md:text-2xl font-black uppercase italic tracking-tight transition-colors truncate ${isOpen ? 'text-white' : 'text-white/60'}`}>
                          {bloque.blockTitle}
                        </h3>
                        <span className="text-white/30 text-sm font-bold shrink-0">({bloque.temas.length} temas)</span>
                      </div>
                    </div>
                    
                    <div onClick={() => toggleBlock(bloque.blockTitle)} className={`cursor-pointer p-2 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'text-[#E1B143] rotate-180' : 'text-white/30'}`}>
                      <HiOutlineChevronDown size={28} />
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ease-in-out w-full ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 md:p-6 flex flex-col gap-3 border-t border-white/5 bg-[#0A0F1C]/40 w-full">
                      {bloque.temas.map((tema: any) => {
                        const isSelected = selectedTemas.includes(tema.id);

                        return (
                          <div 
                            key={tema.id} 
                            onClick={() => handleTemaToggle(tema.id)}
                            className={`border rounded-xl p-4 md:p-5 flex items-center gap-5 transition-all duration-300 cursor-pointer group ${isSelected ? 'bg-[#E1B143]/10 border-[#E1B143]/40 shadow-[0_4px_15px_rgba(225,177,67,0.1)]' : 'bg-[#141B2D] border-transparent hover:bg-white/5'}`}
                          >
                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center border transition-all shrink-0 ${isSelected ? 'bg-[#E1B143] border-[#E1B143] text-black shadow-[0_0_15px_rgba(225,177,67,0.5)]' : 'bg-black/50 border-white/20 group-hover:border-[#E1B143]/50'}`}>
                               {isSelected && <HiOutlineCheckCircle size={20} />}
                            </div>

                            <div className="flex-grow flex items-center gap-4 min-w-0">
                              <span className="text-white/40 text-xs md:text-sm font-black tracking-widest uppercase shrink-0 w-10 text-center">
                                {tema.num}
                              </span>
                              <h4 className={`text-base md:text-lg font-bold leading-relaxed transition-colors truncate ${isSelected ? 'text-[#E1B143]' : 'text-white/80 group-hover:text-white'}`}>
                                {tema.title}
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            }) : (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center w-full">
                <p className="text-white/30 font-medium text-lg max-w-md">No hay temas disponibles para generar tests en esta categoría.</p>
              </div>
            )}
          </div>

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