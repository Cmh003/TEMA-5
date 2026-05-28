import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import imagenLogoBlanco from '../assets/images/logo-yoopoPNGBLANC.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const userName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    "Bombero";

  const handleProtectedAction = (path: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const recursosSections = [
    { id: 'comunidad', title: 'Comunidad', path: '/comunidad' },
    { id: 'estudio', title: 'Estudio', path: '/estudio' },
    { id: 'ranking', title: 'Ranking', path: '/ranking' },
    { id: 'perfil', title: 'Perfil', path: '/perfil' },
  ];

  return (
    <header className="w-full bg-[#131a2c] border-b border-white/5 sticky top-0 z-50">
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
                {recursosSections.map((section) => (
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
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:block w-[90px] md:w-[110px] h-[38px] md:h-[42px] bg-white text-[#1A233A] text-xs md:text-sm font-bold rounded-xl hover:bg-gray-200 transition shadow-md cursor-pointer"
              >
                Log in
              </button>

              <button
                onClick={() => navigate('/register')}
                className="px-3 md:px-4 h-[36px] sm:w-[100px] md:w-[110px] sm:h-[38px] md:h-[42px] bg-[#E1B143] text-white text-[11px] sm:text-xs md:text-sm font-bold rounded-xl hover:bg-[#c99a38] transition shadow-lg cursor-pointer"
              >
                Registro
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-[11px] uppercase tracking-widest text-[#E1B143] font-black mb-0.5">
                  CONECTADO
                </span>
                <span className="text-lg md:text-xl font-bold text-white leading-none">
                  {userName}
                </span>
              </div>

              <button
                onClick={logout}
                className="h-8 sm:h-10 px-3 sm:px-6 flex items-center justify-center rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition shadow-md cursor-pointer"
                title="Cerrar sesión"
              >
                <span className="sm:hidden">Salir</span>
                <span className="hidden sm:block">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}