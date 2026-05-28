import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../../index.css';

import imagenLogo from '../../assets/images/logo-yoopoPNG.png';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { auth } from '../../firebase';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginError, setLoginError] = useState('');

  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

console.log("LOGIN OK", userCredential.user);

navigate('/');
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

 const loginGoogle = async () => {
  try {

    await signInWithPopup(auth, provider);

    navigate('/');

  } catch (error: any) {
    setLoginError(error.message);
  }
};

  const resetPassword = async () => {
    if (!email) {
      alert('Introduce tu correo');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      alert('Correo enviado');
    } catch (error: any) {
      setLoginError(error.message);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Acceso Unificado a Yoopo
          </h1>

          <p className="text-sm sm:text-base text-gray-500">
            Conecta tu cuenta al sistema principal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">

          <div className="flex flex-col gap-1 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8b84a] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8b84a] transition-all"
            />

            {loginError && (
              <span className="text-red-500 text-xs mt-1 font-medium">
                {loginError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#e8b84a] hover:bg-[#f0c45a] text-slate-900 text-lg rounded-lg font-bold transition-colors shadow-md mb-4"
          >
            Iniciar Sesión
          </button>

        </form>

        <button
          onClick={loginGoogle}
          className="w-full p-3 bg-white border border-gray-300 hover:bg-gray-100 text-slate-900 rounded-lg font-semibold transition-colors shadow-sm mb-4"
        >
          Iniciar sesión con Google
        </button>

        <button
          onClick={resetPassword}
          className="text-sm text-[#d4a031] hover:text-[#b88621] font-semibold mb-6"
        >
          Recuperar contraseña
        </button>

        <p className="text-slate-700 text-sm sm:text-base">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-[#d4a031] hover:text-[#b88621] font-bold transition-colors"
          >
            Regístrate
          </Link>
        </p>

      </div>
    </div>
  );
}