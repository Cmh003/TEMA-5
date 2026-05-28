import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imagenLogo from '../../assets/images/logo-yoopoPNG.png'; 
import { createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import { auth } from "../../firebase";

export default function RegisterPage() {
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Re-added the name error state
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(''); 
    setNameError(''); 

    
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
      setNameError('Por favor, ingresa tu nombre completo (nombre y apellido).');
      return;
    }

   
    const isLongEnough = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);

    if (!isLongEnough) {
      setPasswordError('Faltan caracteres (mínimo 8).');
      return; 
    }
    if (!hasUpperCase) {
      setPasswordError('Falta agregar una letra mayúscula.');
      return; 
    }
    if (!hasLowerCase) {
      setPasswordError('Falta agregar una letra minúscula.');
      return; 
    }
    if (!hasNumber) {
      setPasswordError('Falta agregar al menos un número.');
      return; 
    }
    if (!hasSymbol) {
      setPasswordError('Falta agregar un símbolo (como @, #, $, etc.).');
      return; 
    }


try {
  setIsRedirecting(true);

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name.trim()
  });

  setTimeout(() => {
    navigate('/login');
  }, 3000);

} catch (error) {
  console.error("Error al crear cuenta:", error);
  setIsRedirecting(false);
  setPasswordError("No se pudo crear la cuenta. Revisa el correo o intenta con otro.");
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={imagenLogo} 
            alt="Yoopo Logo" 
            className="w-48 h-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          />
        </div>

        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Crea tu cuenta en Yoopo</h1>
          <p className="text-sm sm:text-base text-gray-500">Únete a nuestra comunidad hoy mismo</p>
        </div>
         
        <form onSubmit={handleSubmit} className="w-full">
          
          <div className="flex flex-col gap-1 mb-4">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre Completo" 
              required 
              disabled={isRedirecting}
              className={`w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${nameError ? 'ring-2 ring-red-500' : 'focus:ring-[#e8b84a]'}`}
            />
            {nameError && (
              <span className="text-red-500 text-xs mt-1 font-medium">{nameError}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico" 
              required 
              disabled={isRedirecting}
              className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8b84a] transition-all disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1 mb-6">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required 
              disabled={isRedirecting}
              className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8b84a] transition-all disabled:opacity-50"
            />
            {passwordError && (
              <span className="text-red-500 text-xs mt-1 font-medium">{passwordError}</span>
            )}
          </div>

          <button 
            type="submit"
            disabled={isRedirecting}
            className="w-full p-3 bg-[#e8b84a] hover:bg-[#f0c45a] text-slate-900 text-lg rounded-lg font-bold transition-colors shadow-md mb-6 disabled:opacity-70"
          >
            {isRedirecting ? 'Redirigiendo al login...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-slate-700 text-sm sm:text-base">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#d4a031] hover:text-[#b88621] font-bold transition-colors">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}