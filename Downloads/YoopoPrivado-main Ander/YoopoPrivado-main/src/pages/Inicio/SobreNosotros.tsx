import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';
import Navbar from '../../components/Navbar';
export default function SobreNosotros() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
     <>
    <Navbar />
    <div className="min-h-screen bg-[#1A233A] font-sans relative overflow-hidden flex flex-col items-center w-full text-white/90">
    

      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 pt-20 pb-24 flex flex-col items-center text-center">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col items-center"
        >
          <motion.span variants={itemVariants} className="text-[#E1B143] text-sm md:text-base font-bold uppercase tracking-[0.4em] mb-4">
            Quiénes Somos
          </motion.span>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-12 leading-tight">
            De opositores a bomberos. <br className="hidden md:block" />
            <span className="text-[#E1B143]">De bomberos a formadores.</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="w-full max-w-6xl text-lg md:text-2xl text-white/80 font-light leading-relaxed space-y-8 text-left bg-white/5 p-10 md:p-16 rounded-[2.5rem] border border-white/10 shadow-2xl mb-20">
            <p>
              Todos en el equipo de <strong className="text-white">Yoopo</strong> hemos pasado por lo mismo. Conocemos la frustración de estudiar con temarios desactualizados, la ansiedad de no saber si estás avanzando y la soledad de la biblioteca.
            </p>
            <p>
              Por eso creamos esta plataforma. No queríamos hacer "una academia más". Queríamos construir el ecosistema tecnológico definitivo que a nosotros nos hubiera gustado tener cuando opositábamos.
            </p>
            <p>
              Aquí no hay trucos mágicos, solo <span className="text-[#E1B143] font-bold">disciplina, ciencia cognitiva y la mejor tecnología</span> aplicada al estudio para que consigas tu casco.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {[
              { title: 'Innovación', icon: '💡', desc: 'Tecnología puntera para optimizar tu memoria.' },
              { title: 'Disciplina', icon: '⏱️', desc: 'Herramientas de enfoque militar (Pomodoro).' },
              { title: 'Hermandad', icon: '🤝', desc: 'Una comunidad que empuja en la misma dirección.' }
            ].map((val, i) => (
              <div key={i} className="bg-[#242f4d]/80 backdrop-blur-md p-10 rounded-[2rem] border border-white/5 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                <span className="text-5xl mb-6">{val.icon}</span>
                <h3 className="text-2xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-base text-white/60">{val.desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.button 
            variants={itemVariants}
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-12 py-5 bg-[#E1B143] text-[#1A233A] font-bold text-xl rounded-2xl hover:bg-[#c99a38] transition-colors shadow-xl"
          >
            Volver al inicio
          </motion.button>

        </motion.div>
      </main>

      <footer className="relative z-30 w-full bg-[#131a2c] text-white/30 pt-16 pb-10 border-t border-white/5 mt-auto">
        <div className="w-full px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src={imagenLogoBlanco} alt="Logo" className="h-10 mb-6 opacity-60" />
            <p className="text-sm max-w-xs leading-relaxed">Democratizando el acceso a la preparación de bomberos.</p>
          </div>
          {['Recursos', 'Compañía', 'Legal'].map((title, i) => (
            <div key={title} className="text-center md:text-left">
              <h3 className="text-[#E1B143] font-bold mb-6 uppercase text-xs tracking-widest">{title}</h3>
              <ul className="space-y-3 text-sm font-medium">
                {[['Temario', 'Test Gratis'], ['Nosotros', 'Contacto'], ['Privacidad', 'Cookies']][i].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] tracking-[0.5em] opacity-10 font-bold uppercase">
          © {new Date().getFullYear()} YOOPO.
        </div>
      </footer>
    </div>
    </>
  );
}