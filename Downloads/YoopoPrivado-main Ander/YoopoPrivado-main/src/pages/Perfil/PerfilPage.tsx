import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineUser, HiOutlineStar, HiOutlineBookOpen, HiOutlineFire,
  HiOutlineArrowLeft, HiOutlineCog, HiOutlineBell, HiOutlineLogout,
  HiOutlineBadgeCheck, HiOutlineTrendingUp, HiOutlineCalendar,
  HiOutlineTrash
} from 'react-icons/hi';
import { IoHardwareChipOutline, IoWaterOutline } from 'react-icons/io5';
import { GiWeightLiftingUp } from 'react-icons/gi';
import Navbar from '../../components/Navbar';
// @ts-ignore
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

export default function PerfilPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const nombreDinamico = user?.displayName || user?.email?.split('@')[0] || "Bombero";
  const inicialDinamica = nombreDinamico.charAt(0).toUpperCase();

  // ESTADO DE STRAVA UNIFICADO
  const [stravaConectado, setStravaConectado] = useState(false);

  useEffect(() => {
    // Leemos el estado global al cargar la página
    setStravaConectado(localStorage.getItem('strava_connected') === 'true');
  }, []);

  const handleToggleStrava = () => {
    if (stravaConectado) {
      // Desvincular
      localStorage.setItem('strava_connected', 'false');
      localStorage.removeItem('strava_activities');
      setStravaConectado(false);
    } else {
      // Conectar (Redirección OAuth simulada o real)
      const CLIENT_ID    = '223084';
      const REDIRECT_URI = encodeURIComponent('http://localhost:5173/strava-callback');
      const SCOPE        = encodeURIComponent('read,activity:read_all');
      window.location.href = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${SCOPE}`;
    }
  };

  const userData = {
    nombre: nombreDinamico,
    rango: "Aspirante Élite",
    avatar: inicialDinamica,
    fechaIngreso: "Octubre 2023",
    estadisticas: {
      testsCompletados: 142,
      preguntasAcertadas: 4250,
      kmsStrava: 345.5,
      simulacrosFisicos: 12
    },
    notaMediaGlobal: 8.7,
  };

  const diasParaExamen = 184; 

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
      <>
    <Navbar />
    <div className="flex h-screen bg-[#131a2c] text-white font-sans overflow-hidden scrollbar-hide">
      
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0F1C]/30 relative">
        <header className="h-20 flex justify-between items-center px-10 z-30 border-b border-white/5 bg-[#131a2c]/80 backdrop-blur-lg sticky top-0">
          <h2 className="font-black tracking-widest uppercase text-sm">Panel de <span className="text-[#E1B143]">Opositor</span></h2>
          <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/ajustes')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <HiOutlineCog className="text-xl" />
          </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full mx-auto" style={{ maxWidth: '1100px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
            
            <div className="bg-[#1A233A] rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#E1B143]/20 to-transparent blur-3xl"></div>
              
              <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#E1B143] to-amber-600 rounded-full flex items-center justify-center text-5xl md:text-6xl font-black text-[#131a2c] border-4 border-[#131a2c] shadow-[0_0_30px_rgba(225,177,67,0.4)] shrink-0">
                {userData.avatar}
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#131a2c] rounded-full border border-white/20 flex items-center justify-center text-white text-sm hover:scale-110 transition-transform">
                  ✏️
                </button>
              </div>

              <div className="z-10 flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black">{userData.nombre}</h1>
                  <span className="bg-[#E1B143]/10 text-[#E1B143] border border-[#E1B143]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-max mx-auto md:mx-0">
                    <HiOutlineBadgeCheck className="text-sm" /> {userData.rango}
                  </span>
                </div>
                <p className="text-white/40 text-sm mb-6">Miembro desde {userData.fechaIngreso}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-[#131a2c] px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                    <HiOutlineStar className="text-[#E1B143] text-2xl" />
                    <div className="text-left">
                      <p className="text-[10px] uppercase text-white/40 font-bold">Nota Media Global</p>
                      <p className="text-xl font-black">{userData.notaMediaGlobal}</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* 2. GRID DE MÉTRICAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Tests Completados', value: userData.estadisticas.testsCompletados, icon: <HiOutlineBookOpen/>, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Preguntas Acertadas', value: userData.estadisticas.preguntasAcertadas, icon: <IoHardwareChipOutline/>, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'Simulacros Oficiales', value: userData.estadisticas.simulacrosFisicos, icon: <HiOutlineTrendingUp/>, color: 'text-[#E1B143]', bg: 'bg-[#E1B143]/10' },
                { label: 'Km en Strava', value: userData.estadisticas.kmsStrava, icon: <HiOutlineFire/>, color: 'text-[#fc4c02]', bg: 'bg-[#fc4c02]/10' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#1A233A] p-6 rounded-[2rem] border border-white/5 flex flex-col items-center md:items-start text-center md:text-left hover:bg-white/5 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-[10px] uppercase font-bold text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 3. SALA DE TROFEOS */}
              <div className="lg:col-span-2 bg-[#1A233A] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                  Sala de Trofeos <span className="text-[#E1B143]">Yoopo</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#131a2c]/50 p-4 rounded-2xl border border-[#E1B143]/30 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E1B143] to-yellow-600 rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(225,177,67,0.4)]">🔥</div>
                    <div>
                      <p className="font-bold text-sm text-[#E1B143]">Racha de Hierro</p>
                      <p className="text-xs text-white/50">30 días seguidos haciendo test.</p>
                    </div>
                  </div>
                  <div className="bg-[#131a2c]/50 p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">🧠</div>
                    <div>
                      <p className="font-bold text-sm text-emerald-400">Mente Maestra</p>
                      <p className="text-xs text-white/50">Más de un 9 en simulacro teórico.</p>
                    </div>
                  </div>
                  <div className="bg-[#131a2c]/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-50 grayscale">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">💪</div>
                    <div>
                      <p className="font-bold text-sm text-white">Titán de Banca</p>
                      <p className="text-xs text-white/50">Saca un 10 en Press de Banca.</p>
                    </div>
                  </div>
                  <div className="bg-[#131a2c]/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4 opacity-50 grayscale">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">🌊</div>
                    <div>
                      <p className="font-bold text-sm text-white">Tritón del Parque</p>
                      <p className="text-xs text-white/50">Baja de los 75s en Natación.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. WIDGET DE EXAMEN Y ACCIONES */}
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-br from-red-600/20 to-[#1A233A] p-8 rounded-[2.5rem] border border-red-500/20 text-center relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-red-500/10 text-9xl"><HiOutlineCalendar/></div>
                  <h3 className="text-xs font-black uppercase text-red-400 tracking-widest mb-2 relative z-10">Día D - Comunidad de Madrid</h3>
                  <div className="text-6xl font-black text-white relative z-10 my-2">{diasParaExamen}</div>
                  <p className="text-sm font-bold text-white/50 relative z-10">Días restantes (Estimado)</p>
                </div>

                <div className="bg-[#1A233A] p-6 md:p-8 rounded-[3rem] border border-white/5 flex flex-col gap-4 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-5 md:p-6 text-red-500 hover:bg-red-500/10 rounded-[2rem] transition-all text-sm md:text-base font-bold border border-transparent hover:border-red-500/20"
                  >
                    <span className="flex items-center gap-3">
                      <HiOutlineLogout className="text-2xl"/> Cerrar Sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-10"></div>
          </motion.div>
        </main>
      </div>
    </div>
    </>
  );
}