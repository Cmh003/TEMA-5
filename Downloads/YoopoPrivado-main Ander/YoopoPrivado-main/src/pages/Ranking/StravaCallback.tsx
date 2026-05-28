import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

export default function StravaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('Obteniendo permisos...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // El usuario canceló la autorización en Strava
    if (error === 'access_denied') {
      setEstado('Autorización cancelada. Volviendo...');
      setTimeout(() => navigate('/ranking'), 2000);
      return;
    }

    if (!code) {
      navigate('/ranking');
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        setEstado('Verificando credenciales con la Central Yoopo...');

        const response = await fetch('http://localhost:3000/api/strava/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detalle || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();

        if (data.access_token) {
          setEstado('¡Token obtenido! Descargando entrenamientos...');

          localStorage.setItem('strava_access_token', data.access_token);
          localStorage.setItem('strava_connected', 'true');
          localStorage.setItem('strava_activities', JSON.stringify(data.actividades));
          if (data.athlete) {
            localStorage.setItem('strava_athlete', JSON.stringify(data.athlete));
          }

          setEstado('¡Todo listo! Volviendo al ranking...');
          setTimeout(() => navigate('/ranking'), 1500);

        } else {
          setEstado('Error al validar con Strava.');
          setTimeout(() => navigate('/ranking'), 3000);
        }

      } catch (err: any) {
        console.error('Error conectando con el backend:', err);
        setEstado(`Fallo en la conexión: ${err.message}`);
        setTimeout(() => navigate('/ranking'), 4000);
      }
    };

    exchangeCodeForToken();
  }, [navigate, searchParams]);

  return (
    <div className="flex h-screen bg-[#131a2c] items-center justify-center text-white font-sans selection:bg-[#E1B143]/20">
      <div className="flex flex-col items-center justify-center gap-8 bg-[#1A233A] p-12 md:p-16 rounded-[3rem] border border-[#fc4c02]/20 shadow-[0_0_80px_rgba(252,76,2,0.15)] text-center max-w-md w-full mx-4">

        <img
          src={imagenLogoBlanco}
          alt="Yoopo Logo"
          className="h-12 md:h-14 w-auto object-contain drop-shadow-[0_0_25px_rgba(225,177,67,0.3)]"
        />

        <div className="flex gap-3 items-center py-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#E1B143] animate-bounce shadow-[0_0_10px_rgba(225,177,67,0.5)]" style={{ animationDelay: '0s' }}></div>
          <div className="w-3.5 h-3.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#fc4c02] animate-bounce shadow-[0_0_10px_rgba(252,76,2,0.5)]" style={{ animationDelay: '0.3s' }}></div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-wide">Sincronizando</h2>
          <p className="text-[#E1B143] text-sm font-bold animate-pulse">{estado}</p>
        </div>

      </div>
    </div>
  );
}