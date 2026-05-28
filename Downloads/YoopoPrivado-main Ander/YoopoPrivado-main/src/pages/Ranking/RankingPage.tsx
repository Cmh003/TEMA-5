import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../../context/AuthContext';

import { 
  HiOutlineSearch, HiOutlineBookOpen, HiOutlineFire, 
  HiOutlineStar, HiOutlineUserGroup, HiOutlineArrowLeft,
  HiOutlineLightningBolt, HiOutlineAdjustments, HiOutlinePlay,
  HiOutlineInformationCircle, HiOutlineLockClosed, HiOutlineCheckCircle
} from 'react-icons/hi'; 
import { IoStatsChartOutline, IoWaterOutline } from 'react-icons/io5'; 
import { GiWeightLiftingUp, GiRopeCoil, GiSprint } from 'react-icons/gi';

// @ts-ignore
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png'; 

export default function RankingPage() {
  const navigate = useNavigate();
  // @ts-ignore
  const auth = useAuth() || { isAuthenticated: false, logout: () => {} };
  const { isAuthenticated, logout } = auth;

  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('global');
  const [isSimulacroMode, setIsSimulacroMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stravaData, setStravaData] = useState<any>(null);
  const [isStravaConnected, setIsStravaConnected] = useState(false);  
  const [manualMarks, setManualMarks] = useState({
    cuerda: 10.5, banca: 22, natacion: 85, liso60: 8.9, liso300: 46.5,
    teoria: 8.2, vertigo: true, claustro: true
  });

  const [scores, setScores] = useState({
    p_cuerda: 0, p_banca: 0, p_natacion: 0, p_60m: 0, p_300m: 0, p_2000m: 0, 
    p_teoria: 8.2, global: 0, isApto: true,
    fallos: [] as string[], aMejorar: [] as string[], fuertes: [] as string[]
  });

  const [canSubmit, setCanSubmit] = useState(false);

  // --- LÓGICA DE TIEMPO (Última semana del mes) ---
  useEffect(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = lastDayOfMonth.getDate() - today.getDate();
    setCanSubmit(daysLeft < 7);
  }, []);

  // --- COMPROBAR CONEXIÓN DE STRAVA AL INICIO ---
  // (CORRECCIÓN: Este hook ahora está en el nivel superior, donde debe estar)
  useEffect(() => {
    const data = localStorage.getItem('strava_activities'); 
    if (data) {
      setIsStravaConnected(true);
    }
  }, []);

  // --- LÓGICA DE BAREMOS Y DIAGNÓSTICO INTELIGENTE ---
  useEffect(() => {
    const calc = () => {
      let n_cuerda = Math.min(10, Math.max(0, 5 + ((14.65 - manualMarks.cuerda) * (5 / 7.65))));
      let n_banca = Math.min(10, Math.max(0, 5 + ((manualMarks.banca - 19) * (5 / 11))));
      let n_nata = Math.min(10, Math.max(0, 5 + ((100 - manualMarks.natacion) * (5 / 25))));
      let n_60 = Math.min(10, Math.max(0, 5 + ((10 - manualMarks.liso60) * (5 / 2))));
      let n_300 = Math.min(10, Math.max(0, 5 + ((50 - manualMarks.liso300) * (5 / 8))));
      
      let n_2000 = 5.5; 
      const data = localStorage.getItem('strava_activities');
      if (data) {
        const acts = JSON.parse(data); 
        setStravaData(acts);
        const run = acts.filter((a: any) => a.type === 'Run')[0];
        if (run) {
            const t2k = 2000 / run.average_speed;
            n_2000 = Math.min(10, Math.max(0, 5 + ((460 - t2k) * (5 / 70))));
        }
      }

      const pruebas = [
        { nombre: 'Cuerda', nota: n_cuerda },
        { nombre: 'Banca', nota: n_banca },
        { nombre: 'Natación', nota: n_nata },
        { nombre: '60m Lisos', nota: n_60 },
        { nombre: '300m Lisos', nota: n_300 },
        { nombre: '2000m', nota: n_2000 }
      ];

      const fallos: string[] = pruebas.filter(p => p.nota < 5).map(p => p.nombre);
      if (!manualMarks.vertigo) fallos.push('Vértigo');
      if (!manualMarks.claustro) fallos.push('Claustrofobia');

      const aMejorar: string[] = pruebas.filter(p => p.nota >= 5 && p.nota < 7.5).map(p => p.nombre);
      const fuertes: string[] = pruebas.filter(p => p.nota >= 8.5).map(p => p.nombre);

      const isApto = fallos.length === 0;
      const mediaFisicas = (n_cuerda + n_banca + n_nata + n_60 + n_300 + n_2000) / 6;
      const global = (manualMarks.teoria * 0.6) + (mediaFisicas * 0.4);

      setScores({
        p_cuerda: Number(n_cuerda.toFixed(2)), p_banca: Number(n_banca.toFixed(2)),
        p_natacion: Number(n_nata.toFixed(2)), p_60m: Number(n_60.toFixed(2)),
        p_300m: Number(n_300.toFixed(2)), p_2000m: Number(n_2000.toFixed(2)),
        p_teoria: manualMarks.teoria, global: Number(global.toFixed(2)), isApto,
        fallos, aMejorar, fuertes
      });
    };
    calc();
  }, [manualMarks]);

  const handleConectarStrava = () => {
    const CLIENT_ID    = '223084';
    const REDIRECT_URI = encodeURIComponent('http://localhost:5173/strava-callback');
    const SCOPE        = encodeURIComponent('read,activity:read_all');

    window.location.href =
      `https://www.strava.com/oauth/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&approval_prompt=force` +
      `&scope=${SCOPE}`;
  };

  const submitSimulacroOficial = () => {
    if (!canSubmit) return;
    setShowSuccessModal(true);
  };

  const getRadarPath = () => {
    const points = [
        { val: (scores.p_cuerda + scores.p_banca)/2, angle: 0 },
        { val: (scores.p_60m + scores.p_300m)/2, angle: 72 },
        { val: scores.p_2000m, angle: 144 },
        { val: scores.p_natacion, angle: 216 },
        { val: scores.p_teoria, angle: 288 }
    ];
    return points.map(p => {
        const r = (p.val / 10) * 100;
        const x = 125 + r * Math.cos((p.angle - 90) * Math.PI / 180);
        const y = 125 + r * Math.sin((p.angle - 90) * Math.PI / 180);
        return `${x},${y}`;
    }).join(' ');
  };

  const mockRanking = [
    { id: 1, name: "Carlos_Rescate", avatar: "C", scoreTeoria: 9.8, scoreFisica: 9.5, total: 19.3, isMe: false },
    { id: 2, name: "Laura_Bombera", avatar: "L", scoreTeoria: 9.5, scoreFisica: 9.6, total: 19.1, isMe: false },
    { id: 3, name: "Tú", avatar: "T", scoreTeoria: scores.p_teoria, scoreFisica: ((scores.p_cuerda + scores.p_banca + scores.p_2000m + scores.p_natacion + scores.p_60m + scores.p_300m)/6), total: scores.global, isMe: true },
    { id: 4, name: "Opositor_Fuego", avatar: "O", scoreTeoria: 8.5, scoreFisica: 8.8, total: 17.3, isMe: false },
  ];

  const sortedRanking = [...mockRanking].sort((a, b) => {
    if (activeTab === 'teoria') return b.scoreTeoria - a.scoreTeoria;
    if (activeTab === 'fisicas') return b.scoreFisica - a.scoreFisica;
    return b.total - a.total; 
  });

  return (
    <div className="flex h-screen bg-[#131a2c] text-white font-sans overflow-hidden selection:bg-[#E1B143]/20 relative">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A233A] border-r border-white/5 z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <img src={imagenLogoBlanco} alt="Logo" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 pt-8">
          <button onClick={() => navigate('/estudio')} className="flex items-center gap-3 bg-[#E1B143] text-[#131a2c] p-3.5 rounded-2xl font-black mb-6 hover:scale-105 transition-transform"><HiOutlineArrowLeft/> VOLVER</button>
          <button onClick={() => setIsSimulacroMode(false)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${!isSimulacroMode ? 'bg-white/10 text-[#E1B143]' : 'text-white/40 hover:text-white'}`}><HiOutlineStar className="text-xl"/> Ranking Comunidad</button>
          <button onClick={() => setIsSimulacroMode(true)} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isSimulacroMode ? 'bg-white/10 text-[#E1B143]' : 'text-white/40 hover:text-white'}`}><IoStatsChartOutline className="text-xl"/> Simulacro CM</button>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0F1C]/30 relative z-10">
       <header className="h-20 flex justify-between items-center px-10 z-30 border-b border-white/5 bg-[#131a2c]/80 backdrop-blur-lg">
           <h2 className="font-black tracking-widest uppercase text-sm">Panel de <span className="text-[#E1B143]">Clasificación</span></h2>
           <div className="flex items-center gap-4">
             
             {/* --- RENDERIZADO CONDICIONAL DEL BOTÓN STRAVA --- */}
             {isStravaConnected ? (
               <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 transition-colors cursor-default">
                 <HiOutlineCheckCircle className="text-sm" /> Strava Conectado
               </span>
             ) : (
               <button onClick={handleConectarStrava} className="flex items-center gap-1.5 text-xs font-bold text-[#fc4c02] px-4 py-1.5 rounded-full border border-[#fc4c02]/20 hover:bg-[#fc4c02]/10 transition-colors">
                 Conectar Strava
               </button>
             )}

             <div className="w-10 h-10 bg-[#E1B143] rounded-full flex items-center justify-center text-[#131a2c] font-black">T</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full mx-auto relative" style={{ maxWidth: '1100px' }}>
          
          <AnimatePresence mode="wait">
            {!isSimulacroMode ? (
              <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8 mt-4">
                
                {/* RANKING GENERAL */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-white">Clasificación General</h1>
                    <p className="text-white/40 text-sm">¿Cómo vas frente a los otros {mockRanking.length * 12} opositores?</p>
                  </div>
                  <div className="flex bg-[#1A233A] p-1.5 rounded-full border border-white/5 shadow-inner">
                    <button onClick={() => setActiveTab('global')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'global' ? 'bg-[#E1B143] text-[#131a2c]' : 'text-white/40'}`}>Global</button>
                    <button onClick={() => setActiveTab('teoria')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'teoria' ? 'bg-[#E1B143] text-[#131a2c]' : 'text-white/40'}`}>Teoría</button>
                    <button onClick={() => setActiveTab('fisicas')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'fisicas' ? 'bg-[#E1B143] text-[#131a2c]' : 'text-white/40'}`}>Físicas</button>
                  </div>
                </div>

                <div className="bg-[#1A233A] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[4rem_2fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-white/10 bg-[#131a2c]/50 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <div className="text-center">Pos</div>
                    <div>Opositor</div>
                    <div className="hidden md:block text-center">Oficial</div>
                    <div className="hidden md:block text-center">Físicas</div>
                    <div className="text-right md:text-center text-[#E1B143]">Puntos</div>
                  </div>
                  <div className="flex flex-col">
                    {sortedRanking.map((user, index) => (
                      <div key={user.id} className={`grid grid-cols-[3rem_1fr_auto_auto] md:grid-cols-[4rem_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-white/5 ${user.isMe ? 'bg-[#E1B143]/10 border-l-4 border-[#E1B143]' : ''}`}>
                        <div className="text-center font-bold text-white/30">{index + 1}</div>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${user.isMe ? 'bg-[#E1B143] text-[#131a2c]' : 'bg-white/5'}`}>{user.avatar}</div>
                          <span className="font-bold text-sm">{user.name}</span>
                        </div>
                        <div className="hidden md:block text-center font-bold text-white/60">{user.scoreTeoria.toFixed(1)}</div>
                        <div className="hidden md:block text-center font-bold text-white/60">{user.scoreFisica.toFixed(1)}</div>
                        <div className={`text-right md:text-center font-black text-lg ${user.isMe ? 'text-[#E1B143]' : 'text-white'}`}>{user.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MI RESUMEN */}
                <div className="bg-gradient-to-r from-[#1A233A] to-[#131a2c] rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative">
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center">
                         <div className={`text-6xl font-black leading-none ${scores.isApto ? 'text-[#E1B143]' : 'text-red-400'}`}>{scores.global}</div>
                         <span className="text-[10px] font-black uppercase text-white/30 mt-2 tracking-widest">Mi Media</span>
                      </div>
                      <div className="h-16 w-px bg-white/10 hidden md:block"></div>
                      <div>
                         <h3 className="text-xl font-black uppercase tracking-tighter">Tu Estado Actual</h3>
                         <p className="text-sm text-white/40">Sincronizado con Strava y tus marcas de entrenamiento.</p>
                         
                         {!scores.isApto ? (
                           <div className="flex items-center gap-2 text-red-400 text-xs font-bold mt-2 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 inline-flex">
                             <HiOutlineInformationCircle className="text-base" /> Tienes pruebas suspensas o fobias. Revisa el simulador.
                           </div>
                         ) : scores.aMejorar.length > 0 ? (
                           <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mt-2 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 inline-flex">
                             <HiOutlineInformationCircle className="text-base" /> Tu media es buena, pero deberías mejorar: {scores.aMejorar.slice(0,2).join(', ')}
                           </div>
                         ) : null}
                      </div>
                   </div>
                   <button onClick={() => setIsSimulacroMode(true)} className="bg-[#E1B143] text-[#131a2c] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3 whitespace-nowrap">
                     <HiOutlinePlay className="text-xl" /> Acceder al Simulacro
                   </button>
                </div>

              </motion.div>
            ) : (

              /* ========================================================= */
              /* VISTA 2: LABORATORIO SIMULACRO CON ENVÍO OFICIAL          */
              /* ========================================================= */
              <motion.div key="simulacro" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                
                <div className="flex justify-between items-center bg-[#1A233A] p-6 rounded-[2rem] border border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#E1B143]/10 text-[#E1B143] rounded-2xl flex items-center justify-center text-2xl"><HiOutlineAdjustments/></div>
                      <div>
                        <h2 className="font-black uppercase tracking-tight flex items-center gap-2">
                          Laboratorio de Rendimiento 
                          {canSubmit ? <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/30">Abierto</span> : <span className="bg-white/10 text-white/40 text-[9px] px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">Modo Práctica</span>}
                        </h2>
                        <p className="text-xs text-white/40 text-left">Ajusta tus marcas para ver tu evolución.</p>
                      </div>
                   </div>
                   <button onClick={() => setIsSimulacroMode(false)} className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest border border-white/10 px-5 py-2 rounded-xl transition-all hover:bg-white/5">Cerrar</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* SLIDERS */}
                  <div className="lg:col-span-5 bg-[#1A233A] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <div className="flex flex-col gap-6">
                       {[
                         { label: 'Cuerda (6m)', val: manualMarks.cuerda, min: 6, max: 15, step: 0.1, key: 'cuerda', icon: <GiRopeCoil/>, unit: 's' },
                         { label: 'Banca (40kg)', val: manualMarks.banca, min: 15, max: 40, step: 1, key: 'banca', icon: <GiWeightLiftingUp/>, unit: 'r' },
                         { label: 'Natación (100m)', val: manualMarks.natacion, min: 60, max: 120, step: 1, key: 'natacion', icon: <IoWaterOutline/>, unit: 's' },
                         { label: '60m Lisos', val: manualMarks.liso60, min: 7, max: 11, step: 0.1, key: 'liso60', icon: <GiSprint/>, unit: 's' },
                         { label: '300m Lisos', val: manualMarks.liso300, min: 40, max: 55, step: 0.1, key: 'liso300', icon: <GiSprint/>, unit: 's' },
                       ].map((item) => (
                         <div key={item.key} className="flex flex-col gap-2">
                           <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                             <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                             <span className="text-[#E1B143]">{item.val}{item.unit}</span>
                           </div>
                           <input type="range" min={item.min} max={item.max} step={item.step} value={item.val} onChange={(e) => setManualMarks({...manualMarks, [item.key]: parseFloat(e.target.value)})} className="w-full accent-[#E1B143]" />
                         </div>
                       ))}
                       
                       <div className="pt-4 mt-2 border-t border-white/5 grid grid-cols-2 gap-4">
                          <button onClick={() => setManualMarks({...manualMarks, vertigo: !manualMarks.vertigo})} className={`py-3 rounded-xl font-black text-[10px] border transition-all ${manualMarks.vertigo ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>VÉRTIGO: {manualMarks.vertigo ? 'APTO' : 'NO'}</button>
                          <button onClick={() => setManualMarks({...manualMarks, claustro: !manualMarks.claustro})} className={`py-3 rounded-xl font-black text-[10px] border transition-all ${manualMarks.claustro ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>CLAUSTRO: {manualMarks.claustro ? 'APTO' : 'NO'}</button>
                       </div>
                    </div>
                  </div>

                  {/* RADAR, DIAGNÓSTICO & BOTÓN DE ENVÍO */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-[#1A233A] p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col sm:flex-row items-center gap-8">
                       <div className="relative w-[200px] h-[200px] shrink-0">
                          <svg width="200" height="200" viewBox="0 0 250 250" className="opacity-80">
                             <polygon points="125,25 220.1,94.1 183.8,205.9 66.2,205.9 29.9,94.1" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                             <motion.polygon points={getRadarPath()} fill="rgba(225, 177, 67, 0.4)" stroke="#E1B143" strokeWidth="3" />
                          </svg>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[8px] font-black text-[#E1B143] uppercase">Fuerza</div>
                          <div className="absolute top-1/4 right-0 translate-x-4 text-[8px] font-black text-white/30 uppercase">Velocidad</div>
                          <div className="absolute bottom-4 right-0 text-[8px] font-black text-[#fc4c02] uppercase">Cardio</div>
                          <div className="absolute bottom-4 left-0 text-[8px] font-black text-blue-400 uppercase">Agua</div>
                          <div className="absolute top-1/4 left-0 -translate-x-4 text-[8px] font-black text-emerald-400 uppercase">Teoría</div>
                       </div>
                       
                       <div className="text-left w-full">
                          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Diagnóstico <span className="text-[#E1B143]">Yoopo</span></h3>
                          
                          <div className="flex flex-col gap-3">
                             {scores.fallos.length > 0 && (
                               <div>
                                 <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Motivo de Eliminación</p>
                                 <div className="flex flex-wrap gap-1">
                                   {scores.fallos.map(f => <span key={f} className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] px-2 py-1 rounded font-bold uppercase">❌ {f}</span>)}
                                 </div>
                               </div>
                             )}
                             
                             {scores.aMejorar.length > 0 && (
                               <div>
                                 <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Entrena esto urgentemente (Nota baja)</p>
                                 <div className="flex flex-wrap gap-1">
                                   {scores.aMejorar.map(m => <span key={m} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] px-2 py-1 rounded font-bold uppercase">⚠️ {m}</span>)}
                                 </div>
                               </div>
                             )}

                             {scores.fuertes.length > 0 && (
                               <div>
                                 <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Tus Puntos Fuertes (¡Mantén el nivel!)</p>
                                 <div className="flex flex-wrap gap-1">
                                   {scores.fuertes.map(p => <span key={p} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-1 rounded font-bold uppercase">⭐ {p}</span>)}
                                 </div>
                               </div>
                             )}

                             {scores.fallos.length === 0 && scores.aMejorar.length === 0 && scores.fuertes.length === 0 && (
                               <p className="text-xs text-white/40 italic">Ajusta tus marcas para recibir un análisis personalizado.</p>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border-4 transition-all flex items-center justify-between shadow-2xl overflow-hidden relative ${scores.isApto ? 'bg-gradient-to-br from-[#1A233A] to-[#131a2c] border-[#E1B143]' : 'bg-[#1A233A] border-red-500/30'}`}>
                       {!scores.isApto && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">Fuera de Corte</div>}
                       <div>
                         <p className="text-[10px] font-black text-white/40 uppercase mb-1">Nota Media Matemática</p>
                         <div className={`text-7xl font-black ${scores.isApto ? 'text-white' : 'text-red-400'}`}>
                           {scores.global}
                         </div>
                       </div>
                       <div className="text-right hidden sm:block">
                         <HiOutlineLightningBolt className={`text-6xl ${scores.isApto ? 'text-[#E1B143] opacity-20' : 'text-red-500 opacity-20'}`}/>
                       </div>
                    </div>

                    {/* BOTÓN DE ENVÍO OFICIAL */}
                    <div className="bg-[#1A233A] rounded-[2rem] border border-white/5 shadow-xl flex flex-col justify-center items-center p-6 text-center">
                       {canSubmit ? (
                         <>
                           <p className="text-xs text-emerald-400 font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><HiOutlineCheckCircle className="text-lg" /> Período de envío abierto</p>
                           <button onClick={submitSimulacroOficial} className="w-full bg-[#E1B143] text-[#131a2c] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(225,177,67,0.2)] hover:scale-105 transition-transform hover:bg-amber-400">
                             Enviar Simulacro Oficial
                           </button>
                         </>
                       ) : (
                         <>
                           <p className="text-xs text-yellow-500 font-bold mb-4 uppercase tracking-widest flex items-center gap-2"><HiOutlineLockClosed className="text-lg" /> Fuera del período de examen</p>
                           <button disabled className="w-full bg-white/5 text-white/30 cursor-not-allowed px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/10">
                             Disponible la última semana del mes
                           </button>
                           <p className="text-[10px] text-white/40 mt-3 max-w-xs">Actualmente estás en "Modo Práctica". Puedes modificar tus marcas para ver tu diagnóstico, pero no afectarán al Ranking General.</p>
                         </>
                       )}
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL DE ÉXITO CUSTOMIZADO (REEMPLAZA AL CUTRE-ALERT)     */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1C]/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-[#1A233A] to-[#131a2c] p-8 md:p-12 rounded-[3rem] border border-[#E1B143]/30 shadow-[0_0_80px_rgba(225,177,67,0.2)] max-w-md w-full text-center flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-5xl mb-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <HiOutlineCheckCircle />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">¡Misión Cumplida!</h2>
                <p className="text-base text-white/60 leading-relaxed">
                  Tus marcas oficiales han sido enviadas a la Central de Yoopo. Tu nota proyectada de <span className="text-[#E1B143] font-black">{scores.global}</span> ya computa para el ranking de este mes.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setIsSimulacroMode(false); 
                }}
                className="w-full bg-[#E1B143] text-[#131a2c] px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform hover:bg-amber-400 mt-2"
              >
                Volver a la Clasificación
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}