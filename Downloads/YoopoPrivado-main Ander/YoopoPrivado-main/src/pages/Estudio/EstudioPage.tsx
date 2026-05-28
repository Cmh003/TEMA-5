import React from 'react';
import { useNavigate } from 'react-router-dom';
import miImagenBombero from '../../assets/images/bomberoEstudiando.png';
import { useAuth } from '../../context/AuthContext';
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';
import Navbar from '../../components/Navbar';
import {
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineAcademicCap,
  HiOutlineClock
} from 'react-icons/hi';

export default function EstudioPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    "Bombero";


  const estudioSections = [
    {
      title: 'APUNTES',
      desc: 'Accede a tus apuntes organizados por temas.',
      icon: HiOutlineBookOpen,
      path: '/Apuntes'
    },
    {
      title: 'TESTS',
      desc: 'Prueba tus conocimientos con simulacros.',
      icon: HiOutlineClipboardList,
      path: '/test'
    },
    {
      title: 'FLASHCARDS',
      desc: 'Práctica para los exámenes oficiales.',
      icon: HiOutlineAcademicCap,
      path: '/flashcards'
    },
    {
      title: 'POMODORO',
      desc: 'Gestiona tu tiempo de estudio eficazmente.',
      icon: HiOutlineClock,
      path: '/pomodoro'
    }
  ];

 return (
  <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col">

    <Navbar />
      <main className="flex-grow w-full flex items-center justify-center py-12 lg:py-20 lg:pb-24"> 
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24">

          <div className="mb-12 w-full flex flex-col items-center text-center"> 
              <span className="text-[#E1B143] text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4 opacity-90">
                ¡Hola, {userName.toUpperCase()}!
              </span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 uppercase italic tracking-tight text-[#E1B143] lg:text-white">
                   Centro de <span className="lg:text-[#E1B143]">Estudio Integrado</span>
              </h1>

              <p className="text-white/50 text-lg md:text-xl max-w-3xl px-4 leading-relaxed">
                  Optimiza tu preparación con herramientas diseñadas específicamente para opositores a bomberos.
              </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {estudioSections.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate(s.path)}
                    className="bg-[#141B2D] border border-white/10 rounded-[2rem] p-8 h-[240px] flex flex-col justify-between 
                    hover:border-[#E1B143]/50 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(225,177,67,0.15)]
                    transition-all duration-300 cursor-pointer group text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col items-center mb-4 gap-2 w-full">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight group-hover:text-[#E1B143] transition uppercase italic">
                          {s.title}
                        </h2>
                        <div className="h-[3px] w-12 bg-[#E1B143] group-hover:w-20 transition-all duration-300"></div>
                      </div>
                      <p className="text-white/50 text-sm md:text-base max-w-[240px] mx-auto leading-relaxed font-medium">
                        {s.desc}
                      </p>
                    </div>

                    <div className="w-full bg-[#0A0F1C]/60 rounded-xl h-20 flex items-center justify-center text-white/20 group-hover:text-[#E1B143] transition duration-500">
                      <Icon size={38} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-5 relative rounded-[2rem] overflow-hidden border border-white/10 min-h-[420px] group bg-[#141B2D]">
              <img 
                src={miImagenBombero} 
                alt="Bombero" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-10 left-10 right-10 text-center lg:text-left">
                <span className="text-[#E1B143] font-black italic text-4xl md:text-5xl tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] uppercase">
                  #FORJANDOELÉXITO
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="w-full bg-[#050810] text-white/30 pt-16 pb-10 border-t border-white/5 mt-auto">
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
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