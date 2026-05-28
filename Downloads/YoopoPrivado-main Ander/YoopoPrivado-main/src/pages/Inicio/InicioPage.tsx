import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

import imagenComunidad from '../../assets/images/Comunidad.png';
import imagenEstudio from '../../assets/images/Estudio.jpg';
import imagenRanking from '../../assets/images/Ranking.png';
import imagenPerfil from '../../assets/images/Perfil.png';
import imagenBombero from '../../assets/images/Bombero.png';
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

export default function InicioPage() {
  const navigate = useNavigate();
 const { user, logout } = useAuth();

const isAuthenticated = !!user;
  useEffect(() => {
    if (isAuthenticated) {
      const cookieExists = document.cookie.split('; ').some(row => row.trim().startsWith('yoopo_session='));
      const hasLoginMarker = localStorage.getItem('yoopo_login_marker');

      if (!cookieExists && hasLoginMarker) {
        localStorage.removeItem('yoopo_login_marker');
        logout();
      } else if (!cookieExists && !hasLoginMarker) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = `yoopo_session=active;expires=${expires.toUTCString()};path=/`;
        localStorage.setItem('yoopo_login_marker', 'true');
      }
    }
  }, [isAuthenticated, logout]);

  const sections = [
    { id: 'comunidad', title: 'Comunidad', path: '/comunidad', image: imagenComunidad },
    { id: 'estudio', title: 'Estudio', path: '/estudio', image: imagenEstudio },
    { id: 'ranking', title: 'Ranking', path: '/ranking', image: imagenRanking },
    { id: 'perfil', title: 'Perfil', path: '/perfil', image: imagenPerfil },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleProtectedAction = (path: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#1A233A] font-sans relative overflow-hidden flex flex-col items-center w-full text-white/90">

      <header className="w-full bg-[#1A233A]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 flex justify-between items-center h-20">
          
          <img 
            src={imagenLogoBlanco} 
            alt="Yoopo Logo" 
            className="h-8 sm:h-10 w-auto cursor-pointer shrink-0" 
            onClick={() => navigate('/')} 
          />

          <nav className="flex items-center gap-4 md:gap-12 lg:gap-24">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-white/70 group-hover:text-[#E1B143] transition-colors font-semibold text-xs sm:text-sm uppercase tracking-widest outline-none py-6">
                Recursos
                <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-52 bg-[#1A233A] border border-white/10 rounded-xl shadow-2xl flex flex-col p-1.5">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleProtectedAction(section.path)}
                      className="group/item flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors outline-none cursor-pointer"
                    >
                      <span>{section.title}</span>
                      <svg className="w-4 h-4 text-[#E1B143] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                  
                  <div className="md:hidden border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={() => handleProtectedAction('/estudio')}
                      className="group/item flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors outline-none cursor-pointer"
                    >
                      <span>App</span>
                      <svg className="w-4 h-4 text-[#E1B143] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigate('/nosotros')}
                      className="group/item flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors outline-none cursor-pointer"
                    >
                      <span>Sobre Nosotros</span>
                      <svg className="w-4 h-4 text-[#E1B143] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleProtectedAction('/proximamente')} 
              className="hidden md:block text-white/70 hover:text-[#E1B143] transition-colors font-semibold text-sm uppercase tracking-widest py-6 cursor-pointer"
            >
              App
            </button>
            <button 
              onClick={() => navigate('/nosotros')} 
              className="hidden md:block text-white/70 hover:text-[#E1B143] transition-colors font-semibold text-sm uppercase tracking-widest py-6 cursor-pointer"
            >
              Sobre Nosotros
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!isAuthenticated ? (
              <>
                <button onClick={() => navigate('/login')} className="hidden sm:block w-[90px] md:w-[110px] h-[38px] md:h-[42px] bg-white text-[#1A233A] text-xs md:text-sm font-bold rounded-xl hover:bg-gray-200 transition shadow-md cursor-pointer">Log in</button>
                <button onClick={() => navigate('/register')} className="px-3 md:px-4 h-[36px] sm:w-[100px] md:w-[110px] sm:h-[38px] md:h-[42px] bg-[#E1B143] text-white text-[11px] sm:text-xs md:text-sm font-bold rounded-xl hover:bg-[#c99a38] transition shadow-lg cursor-pointer">Registro</button>
              </>
            ) : (
              <div className="flex items-center gap-3 md:gap-5">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-[11px] uppercase tracking-widest text-[#E1B143] font-black mb-0.5">
                    CONECTADO
                  </span>
                  <span className="text-lg md:text-xl font-bold text-white leading-none">
                    {user?.displayName || user?.email || "Usuario"}
                  </span>
                </div>
                <button 
                  onClick={logout} 
                  className="h-8 sm:h-10 px-3 sm:px-6 flex items-center justify-center rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition shadow-md cursor-pointer"
                  title="Cerrar sesión"
                >
                  <span className="sm:hidden">Cerrar Sessión</span>
                  <span className="hidden sm:block">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="hidden lg:block absolute top-[80px] right-[-5%] w-[70%] h-[1500px] z-0 pointer-events-none">
        <motion.img
          src={imagenBombero}
          alt="Bombero"
          className="w-full h-full object-contain object-top drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
      </div>

      <main className="relative z-10 w-full px-6 md:px-16 lg:px-24 pt-28 pb-24 flex flex-col md:flex-row items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-2/3 xl:w-1/2"
        >
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            {isAuthenticated ? (
              <>
                {getGreeting()},<br />
                <span className="text-[#E1B143]">{user?.displayName || user?.email || "Usuario"}</span>
              </>
            ) : (
              <>
                ¿Pensando en opositar?<br />
                <span className="text-[#E1B143]">¿Quieres aprobar?</span>
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-white/70 font-light mb-10 max-w-2xl leading-relaxed">
            Prepárate con Yoopo, la plataforma líder diseñada por y para bomberos.
          </p>

          {isAuthenticated ? (
            <button
              onClick={() => handleProtectedAction('/estudio')}
              className="inline-flex items-center justify-center px-12 py-5 bg-[#E1B143] text-[#1A233A] font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              Continuar Estudiando
            </button>
          ) : (
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center px-12 py-5 bg-[#E1B143] text-[#1A233A] font-bold text-xl rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              Comienza Gratis
            </button>
          )}
        </motion.div>
      </main>

      <section className="relative z-20 w-full px-6 md:px-16 lg:px-24 -mt-8 pb-16 lg:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10"
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              onClick={() => handleProtectedAction(section.path)}
              className="relative h-72 rounded-[2.5rem] overflow-hidden cursor-pointer group border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <img 
                src={section.image} 
                alt={section.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-[#1A233A]/60 group-hover:bg-[#1A233A]/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-[0.2em] text-center px-4">
                  {section.title}
                </h3>
                <div className="w-12 h-1.5 bg-[#E1B143] mt-4 rounded-full group-hover:w-24 transition-all" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-30 w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">
        <div className="w-full max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-150px" }}
            className="min-h-[450px] h-auto bg-[#242f4d]/90 backdrop-blur-xl rounded-[3.5rem] p-10 md:p-20 shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/5 flex flex-col items-center text-center justify-center"
          >
            <span className="text-[#E1B143] text-sm font-bold uppercase tracking-[0.4em] mb-6 opacity-70">
              Nuestra Metodología
            </span>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              Sobre Nosotros: <br className="hidden md:block" />
              <span className="text-[#E1B143]"> Pasión por el servicio.</span>
            </h2>

            <p className="max-w-4xl text-lg md:text-2xl text-white/80 leading-relaxed mb-12 font-light italic">
              "Yoopo nació de la experiencia directa de <span className="text-white font-semibold">bomberos y formadores</span> que entendieron que la preparación tradicional necesitaba evolucionar."
            </p>

            <div 
              onClick={() => navigate('/nosotros')}
              className="group inline-flex items-center justify-center bg-[#354060] border border-white/10 px-10 py-5 rounded-2xl text-white font-bold text-xl hover:bg-[#404c70] transition-all shadow-2xl cursor-pointer"
            >
              <span className="whitespace-nowrap mr-4">Conoce nuestra historia</span>
              <svg className="w-7 h-7 text-[#E1B143] transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-30 w-full bg-[#131a2c] text-white/30 pt-20 pb-12 border-t border-white/5 mt-auto">
        <div className="w-full px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src={imagenLogoBlanco} alt="Logo" className="h-12 mb-6 opacity-60" />
            <p className="text-sm max-w-xs leading-relaxed">Democratizando el acceso a la preparación de bomberos.</p>
          </div>
          {['Recursos', 'Compañía', 'Legal'].map((title, i) => (
            <div key={title} className="text-center md:text-left">
              <h3 className="text-[#E1B143] font-bold mb-6 uppercase text-sm tracking-widest">{title}</h3>
              <ul className="space-y-4 text-sm font-medium">
                {[['Temario', 'Test Gratis'], ['Nosotros', 'Contacto'], ['Privacidad', 'Cookies']][i].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors cursor-pointer">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-[11px] tracking-[0.5em] opacity-10 font-bold uppercase">
          © {new Date().getFullYear()} YOOPO.
        </div>
      </footer>
    </div>
  );
}