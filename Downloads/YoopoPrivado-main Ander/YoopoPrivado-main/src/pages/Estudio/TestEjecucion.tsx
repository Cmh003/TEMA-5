import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { 
  HiOutlineClock, 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlineX
} from 'react-icons/hi';

import bancoDePreguntas from '../../data/preguntas.json';

interface Pregunta {
  id: number;
  temaId: number;
  enunciado: string;
  opciones: string[];
  correcta: number;
  justificacion?: string; 
}

export default function TestEjecucion() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const config = location.state || { temasSeleccionados: [], cantidadPreguntas: 10, modo: 'entrenamiento' };
  
  const [preguntasTest, setPreguntasTest] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [tiempoRestante, setTiempoRestante] = useState(config.cantidadPreguntas * 60); 
  const [testGenerado, setTestGenerado] = useState(false);

  useEffect(() => {
    if (config.temasSeleccionados.length > 0 && !testGenerado) {
      
      const preguntasFiltradas = (bancoDePreguntas as Pregunta[]).filter(q => 
        config.temasSeleccionados.includes(q.temaId)
      );

      const preguntasMezcladas = preguntasFiltradas.sort(() => 0.5 - Math.random());
      const preguntasCortadas = preguntasMezcladas.slice(0, config.cantidadPreguntas);

      const preguntasFinales = preguntasCortadas.map(pregunta => {
        const opcionesConEstado = pregunta.opciones.map((texto, indexOriginal) => ({
          texto: texto,
          esCorrecta: indexOriginal === pregunta.correcta
        }));

        const opcionesMezcladas = opcionesConEstado.sort(() => 0.5 - Math.random());
        const nuevoIndiceCorrecto = opcionesMezcladas.findIndex(op => op.esCorrecta);

        return {
          ...pregunta,
          opciones: opcionesMezcladas.map(op => op.texto),
          correcta: nuevoIndiceCorrecto
        };
      });

      setPreguntasTest(preguntasFinales);
      setTestGenerado(true);
    }
  }, [config, testGenerado]);

  useEffect(() => {
    if (tiempoRestante <= 0 || preguntasTest.length === 0) return;
    const timer = setInterval(() => setTiempoRestante(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante, preguntasTest.length]);

  const formatoTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleSeleccionarOpcion = (indiceOpcion: number) => {
    if (config.modo === 'entrenamiento' && respuestas[preguntaActual] !== undefined) {
      return; 
    }
    setRespuestas({ ...respuestas, [preguntaActual]: indiceOpcion });
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntasTest.length - 1) setPreguntaActual(prev => prev + 1);
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) setPreguntaActual(prev => prev - 1);
  };

  const finalizarTest = () => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres finalizar el test? Las preguntas sin responder se contarán como blanco.");
    if(confirmacion) {
      let aciertos = 0;
      let fallos = 0;
      
      preguntasTest.forEach((preg, idx) => {
        if (respuestas[idx] !== undefined) {
          if (respuestas[idx] === preg.correcta) {
            aciertos++;
          } else {
            fallos++;
          }
        }
      });

      const blancos = preguntasTest.length - (aciertos + fallos);
      const tiempoTotalAsignado = config.cantidadPreguntas * 60;
      const tiempoConsumido = tiempoTotalAsignado - tiempoRestante;

      navigate('/test/resultados', { 
        state: { 
          aciertos, 
          fallos, 
          blancos, 
          total: preguntasTest.length, 
          tiempoConsumido,
          modo: config.modo
        } 
      });
    }
  };

  if (testGenerado && preguntasTest.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6 text-center font-sans w-full">
        <div className="bg-[#141B2D] p-8 md:p-12 rounded-[2rem] border border-white/10 max-w-lg shadow-2xl w-full mx-auto">
          <HiOutlineXCircle size={70} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-white font-black uppercase italic tracking-tight text-3xl mb-4">Sin preguntas</h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Aún no hemos subido preguntas para los temas que has seleccionado.
          </p>
          <button onClick={() => navigate('/test')} className="bg-[#E1B143] text-black px-8 py-5 rounded-xl font-black uppercase tracking-widest text-sm w-full hover:shadow-[0_0_20px_rgba(225,177,67,0.4)] transition-all">
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (preguntasTest.length === 0) return null;

  const pregunta = preguntasTest[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntasTest.length) * 100;
  
  const yaRespondida = respuestas[preguntaActual] !== undefined;
  const modoEntrenamiento = config.modo === 'entrenamiento';
  const mostrarJustificacion = modoEntrenamiento && yaRespondida;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black w-full overflow-x-hidden">
      
      <header className="w-full bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20 h-20 md:h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => navigate('/test')} className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl transition-all shrink-0" title="Salir del test">
              <HiOutlineXCircle className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] md:text-xs font-black tracking-[0.15em] md:tracking-[0.2em] text-[#E1B143] uppercase leading-tight truncate mb-1">Modo {config.modo}</span>
              <span className="text-xs md:text-base font-bold text-white/70 leading-tight truncate">{config.temasSeleccionados.length} Temas</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 md:gap-4 bg-[#141B2D] px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border border-white/5 shadow-inner shrink-0">
              <HiOutlineClock className={`w-5 h-5 md:w-7 md:h-7 ${tiempoRestante < 300 ? "text-red-500 animate-pulse" : "text-[#E1B143]"}`} />
              <span className={`font-mono text-lg md:text-3xl font-bold tracking-wider ${tiempoRestante < 300 ? "text-red-500" : "text-white"}`}>
                {formatoTiempo(tiempoRestante)}
              </span>
            </div>
            
            <button 
              onClick={finalizarTest} 
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] shrink-0"
            >
              <span className="hidden sm:block">Finalizar Test</span>
              <span className="block sm:hidden">Finalizar</span>
            </button>
          </div>

        </div>
        
        <div className="w-full h-1.5 md:h-2 bg-[#141B2D]">
          <div className="h-full bg-[#E1B143] transition-all duration-500 ease-out shadow-[0_0_20px_rgba(225,177,67,0.6)]" style={{ width: `${progreso}%` }}></div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto flex flex-col items-center justify-start pt-10 md:pt-16 px-6 md:px-12 lg:px-20 pb-24">
        
        <div className="w-full max-w-[1200px] flex flex-col gap-8 md:gap-12">
          
          <div className="w-full flex justify-between items-center border-b border-white/10 pb-6">
            <span className="text-base md:text-lg font-black uppercase tracking-widest text-white/40">
              Pregunta <span className="text-white text-xl md:text-2xl ml-1">{preguntaActual + 1}</span> <span className="text-white/20 mx-2">/</span> {preguntasTest.length}
            </span>
            {yaRespondida && (
              <span className="flex items-center gap-2 text-xs md:text-sm uppercase font-black tracking-widest text-emerald-400 bg-emerald-400/10 px-4 md:px-5 py-2 md:py-2.5 rounded-xl border border-emerald-400/20">
                <HiOutlineCheckCircle size={20} /> Respondida
              </span>
            )}
          </div>

          <div className="w-full">
            <h2 className="text-2xl md:text-4xl font-medium leading-relaxed md:leading-normal text-white/95">
              {pregunta.enunciado}
            </h2>
          </div>

          <div className="w-full flex flex-col gap-4 md:gap-6">
            {pregunta.opciones.map((opcion: string, index: number) => {
              const isSelected = respuestas[preguntaActual] === index;
              const isCorrect = pregunta.correcta === index;
              const letras = ['A', 'B', 'C', 'D'];
              
              let containerClass = "bg-[#141B2D] border-white/5 hover:border-[#E1B143]/50 hover:bg-[#1a233a] text-white/80";
              let iconClass = "bg-white/5 text-white/40 border-white/10 group-hover:bg-[#E1B143]/20 group-hover:text-[#E1B143] group-hover:border-[#E1B143]/30";
              
              if (modoEntrenamiento && yaRespondida) {
                if (isCorrect) {
                  containerClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-50";
                  iconClass = "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]";
                } else if (isSelected && !isCorrect) {
                  containerClass = "bg-red-500/10 border-red-500/40 text-red-50";
                  iconClass = "bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                } else {
                  containerClass = "bg-[#0A0F1C] border-white/5 text-white/30 opacity-60";
                  iconClass = "bg-white/5 text-white/20 border-white/5";
                }
              } else {
                if (isSelected) {
                  containerClass = "bg-[#E1B143]/10 border-[#E1B143]/50 text-white shadow-[0_5px_25px_rgba(225,177,67,0.15)] -translate-y-1";
                  iconClass = "bg-[#E1B143] text-black border-[#E1B143] shadow-[0_0_20px_rgba(225,177,67,0.4)]";
                }
              }

              return (
                <button
                  key={index}
                  disabled={modoEntrenamiento && yaRespondida}
                  onClick={() => handleSeleccionarOpcion(index)}
                  className={`w-full text-left p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border flex items-start md:items-center gap-4 md:gap-8 transition-all duration-300 group ${containerClass} ${modoEntrenamiento && yaRespondida ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-xl font-black transition-all duration-300 border ${iconClass}`}>
                    {modoEntrenamiento && yaRespondida && isCorrect ? <HiOutlineCheckCircle size={28} /> : 
                     modoEntrenamiento && yaRespondida && isSelected && !isCorrect ? <HiOutlineX size={28} /> : 
                     letras[index]}
                  </div>
                  <span className={`text-base md:text-xl leading-relaxed md:pt-0 font-medium`}>
                    {opcion}
                  </span>
                </button>
              );
            })}
          </div>

          {mostrarJustificacion && (
            <div className="w-full mt-4 bg-[#1e293b]/50 border border-blue-400/20 rounded-3xl p-6 md:p-10 shadow-inner animate-[fadeIn_0.4s_ease-out]">
              <div className="flex items-center gap-3 md:gap-4 text-blue-400 mb-4 md:mb-6">
                <HiOutlineLightBulb className="w-7 h-7 md:w-9 md:h-9" />
                <h3 className="font-black uppercase tracking-widest text-sm md:text-lg">Justificación de la respuesta</h3>
              </div>
              <p className="text-white/80 leading-relaxed text-base md:text-xl">
                {pregunta.justificacion || "La solución a esta pregunta se deriva directamente de lo establecido en el temario oficial."}
              </p>
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-8 pt-8 border-t border-white/5">
            <button 
              onClick={handleAnterior}
              disabled={preguntaActual === 0}
              className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-xs md:text-base font-black uppercase tracking-widest transition-all ${preguntaActual === 0 ? 'opacity-30 cursor-not-allowed text-white/50 bg-transparent' : 'bg-[#141B2D] border border-white/5 hover:bg-white/10 text-white hover:shadow-lg'}`}
            >
              <HiOutlineChevronLeft className="w-5 h-5 md:w-7 md:h-7" /> <span>Anterior</span>
            </button>
            
            {preguntaActual === preguntasTest.length - 1 ? (
              <button onClick={finalizarTest} className="flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-xs md:text-base font-black uppercase tracking-widest transition-all bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                <span>Terminar</span> <HiOutlineCheckCircle className="w-5 h-5 md:w-7 md:h-7" />
              </button>
            ) : (
              <button 
                onClick={handleSiguiente}
                className={`flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-xs md:text-base font-black uppercase tracking-widest transition-all ${mostrarJustificacion ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-pulse' : 'bg-[#E1B143] text-black hover:bg-white hover:shadow-[0_0_25px_rgba(225,177,67,0.4)]'}`}
              >
                <span>Siguiente</span> <HiOutlineChevronRight className="w-5 h-5 md:w-7 md:h-7" />
              </button>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}