import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; 
import { 
  HiOutlineArrowLeft, HiOutlineUser, HiOutlineLockClosed, 
  HiOutlineBell, HiOutlineShieldCheck, HiOutlineCreditCard, 
  HiOutlineTrash, HiOutlineCheckCircle, HiOutlineFire,
  HiOutlineMail, HiOutlinePencilAlt
} from 'react-icons/hi';
import { SiStrava } from 'react-icons/si';

export default function AjustesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const nombreDinamico = user?.displayName || user?.email?.split('@')[0] || "Bombero";
  const emailDinamico = user?.email || "sin-correo@yoopo.es";

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    email: "",
    biografia: "",
    privadoRanking: false,
    notifSimulacro: true,
    notifComunidad: true,
    stravaConectado: false
  });

  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const userExtraJson = localStorage.getItem('user_data');
    const stravaStatus = localStorage.getItem('strava_connected') === 'true';
    const settingsJson = localStorage.getItem('user_settings');

    const userExtra = userExtraJson ? JSON.parse(userExtraJson) : { bio: "A por la plaza en Madrid 🚒" };
    const settings = settingsJson ? JSON.parse(settingsJson) : { privadoRanking: false, notifSimulacro: true, notifComunidad: true };

    setFormData({
      nombreUsuario: nombreDinamico, 
      email: emailDinamico,          
      biografia: userExtra.bio || "A por la plaza en Madrid 🚒",
      privadoRanking: settings.privadoRanking,
      notifSimulacro: settings.notifSimulacro,
      notifComunidad: settings.notifComunidad,
      stravaConectado: stravaStatus
    });
  }, [nombreDinamico, emailDinamico]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // CONTROLADOR UNIFICADO DE STRAVA
  const handleStravaToggle = () => {
    const newState = !formData.stravaConectado;
    setFormData(prev => ({ ...prev, stravaConectado: newState }));
    
    // Sincronizar bandera con localStorage
    localStorage.setItem('strava_connected', newState ? 'true' : 'false');
    
    // Si desvinculamos, borrar la caché de actividades de Strava
    if (!newState) {
      localStorage.removeItem('strava_activities');
    }
  };

  const handleGuardar = () => {
    const userDataToSave = {
      nombre: formData.nombreUsuario,
      email: formData.email,
      bio: formData.biografia
    };
    
    const settingsToSave = {
      privadoRanking: formData.privadoRanking,
      notifSimulacro: formData.notifSimulacro,
      notifComunidad: formData.notifComunidad
    };

    localStorage.setItem('user_data', JSON.stringify(userDataToSave));
    localStorage.setItem('user_settings', JSON.stringify(settingsToSave));

    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#131a2c] text-white font-sans flex flex-col items-center px-6 md:px-12 lg:px-20 py-8 relative">
      
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 sticky top-6 z-50 bg-[#131a2c]/90 backdrop-blur-md px-6 py-4 md:px-8 md:py-5 rounded-[2rem] border border-white/5 shadow-2xl">
        <button onClick={() => navigate('/perfil')} className="flex items-center gap-3 text-white/50 hover:text-[#E1B143] font-bold transition-colors">
          <HiOutlineArrowLeft className="text-2xl"/> <span className="hidden md:inline">Volver al Perfil</span>
        </button>
        <button onClick={handleGuardar} className="bg-[#E1B143] text-[#131a2c] px-8 py-3.5 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(225,177,67,0.4)] text-xs md:text-sm">
          Guardar Cambios
        </button>
      </div>

      <AnimatePresence>
        {guardado && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-28 z-50 bg-emerald-500 text-[#131a2c] px-8 py-4 rounded-full font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.5)]">
            <HiOutlineCheckCircle className="text-2xl"/> Cambios Guardados en el Sistema
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl flex flex-col gap-10 pb-24 mt-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Centro de <span className="text-[#E1B143]">Ajustes</span></h1>
          <p className="text-white/40 text-base">Gestiona tu expediente, privacidad e integraciones deportivas para la Comunidad de Madrid.</p>
        </div>

        <section className="bg-[#1A233A] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-xl">
          <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-[#E1B143] flex items-center gap-3 mb-8"><HiOutlineUser className="text-xl"/> Información del Perfil</h2>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2"><HiOutlinePencilAlt size={16}/> Alias en Comunidad</label>
                <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleInputChange} className="bg-[#131a2c] border border-white/10 rounded-2xl px-5 py-4 text-white text-base md:text-lg outline-none focus:border-[#E1B143] transition-colors shadow-inner" placeholder="Ej: Carlos_Rescate" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2"><HiOutlineMail size={16}/> Correo Electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="bg-[#131a2c] border border-white/10 rounded-2xl px-5 py-4 text-white/50 text-base md:text-lg outline-none cursor-not-allowed shadow-inner" readOnly title="Para cambiar el email contacta con soporte" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Biografía Corta (Visible en tus historias)</label>
              <textarea name="biografia" value={formData.biografia} onChange={handleInputChange} rows={3} className="bg-[#131a2c] border border-white/10 rounded-2xl px-5 py-4 text-white text-base outline-none focus:border-[#E1B143] transition-colors resize-none shadow-inner" placeholder="Añade una frase motivadora..."></textarea>
            </div>

            <div className="p-5 md:p-6 bg-[#E1B143]/10 border border-[#E1B143]/20 rounded-2xl flex items-start gap-4 mt-2">
              <HiOutlineFire className="text-[#E1B143] text-2xl md:text-3xl shrink-0 mt-0.5"/>
              <p className="text-sm md:text-base text-[#E1B143]/80 leading-relaxed font-medium">
                Tu perfil está configurado exclusivamente para la oposición de <strong className="text-[#E1B143]">Bomberos de la Comunidad de Madrid</strong>. Los baremos y simulacros se ajustarán automáticamente a las bases de la última convocatoria oficial (BOCM).
              </p>
            </div>
          </div>
        </section>


        <section className="bg-[#1A233A] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-xl">
          <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-blue-400 flex items-center gap-3 mb-8"><HiOutlineLockClosed className="text-xl"/> Privacidad y Alertas</h2>
          
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => handleToggle('privadoRanking')}>
              <div className="pr-6">
                <p className="font-bold text-base md:text-lg text-white transition-colors group-hover:text-blue-400 mb-1">Ocultar mi nota del Ranking Público</p>
                <p className="text-sm text-white/40 leading-relaxed">Tu nota y alias no serán visibles en la tabla general, pero tú sí podrás ver la del resto.</p>
              </div>
              <button className={`w-16 h-8 rounded-full transition-all relative shrink-0 ${formData.privadoRanking ? 'bg-blue-500' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.privadoRanking ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <hr className="border-white/5" />
            
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => handleToggle('notifSimulacro')}>
              <div className="pr-6">
                <p className="font-bold text-base md:text-lg text-white transition-colors group-hover:text-emerald-400 mb-1">Recordatorio de Examen Oficial</p>
                <p className="text-sm text-white/40 leading-relaxed">Avisarme 24h antes de que se abra la ventana de envío de simulacros de la última semana.</p>
              </div>
              <button className={`w-16 h-8 rounded-full transition-all relative shrink-0 ${formData.notifSimulacro ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.notifSimulacro ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            <hr className="border-white/5" />
            
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => handleToggle('notifComunidad')}>
              <div className="pr-6">
                <p className="font-bold text-base md:text-lg text-white transition-colors group-hover:text-emerald-400 mb-1">Interacciones en Comunidad</p>
                <p className="text-sm text-white/40 leading-relaxed">Notificarme si alguien me da "Me gusta" o comenta en mis publicaciones o historias.</p>
              </div>
              <button className={`w-16 h-8 rounded-full transition-all relative shrink-0 ${formData.notifComunidad ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.notifComunidad ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#1A233A] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-xl flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-br from-[#131a2c] to-[#0a0f1c] p-8 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-5 w-full">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E1B143] to-amber-600 text-[#131a2c] rounded-2xl flex items-center justify-center text-3xl shadow-lg"><HiOutlineCreditCard/></div>
              <div>
                <p className="font-black text-white text-xl mb-1">Plan Yoopo Gratis</p>
                <p className="text-sm text-emerald-400 font-bold">Activo </p>
              </div>
            </div>
            <button className="w-full md:w-auto whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
              Gestionar Plan
            </button>
          </div>

          <div className="pt-4 flex flex-col items-center">
            <button className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-8 py-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all">
              <HiOutlineTrash className="text-2xl"/> Eliminar mi cuenta permanentemente
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}