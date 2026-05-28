import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import imagenLogoBlanco from '../../assets/images/logo-yoopoPNGBLANC.png';

import { 
  HiOutlineSearch, 
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineArrowLeft,
  HiOutlineFire
} from 'react-icons/hi';

export default function ApuntesPage() {
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useAuth();

const userName =
  user?.displayName ||
  user?.email?.split('@')[0] ||
  "Bombero";

const userInitial = userName.charAt(0).toUpperCase();
  
  const [activeBlock, setActiveBlock] = useState('conductor_nuevo');
  const [openBlocks, setOpenBlocks] = useState({});

  const [userProgress, setUserProgress] = useState({});
  const [viewerData, setViewerData] = useState(null);

  useEffect(() => {
    if (user) {
      const progressKey = `yoopo_user_progress_${user.uid}`;
      const savedProgress = localStorage.getItem(progressKey);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress({});
      }
    }
  }, [user]);

  const plazas = [
    { id: 'operador_c1', title: 'Operador C1 (Orden 1083/2025)' },
    { id: 'tecnico_a2', title: 'Oficial Técnico A2 (Orden 450/2022)' },
    { id: 'conductor_nuevo', title: 'Bombero Esp. Conductor C1 (Nuevo actualizado)' }
  ];

  const temario = {
    operador_c1: [
      {
        blockTitle: 'Temario Completo',
        temas: [
          { id: 101, num: 'T01', title: 'La Función Pública', progress: 100, lastAccessed: 'Ayer', timeSpent: '45m', urlPdf: '/pdfs/temario_operador_c1/T01. La Función Pública.pdf' },
          { id: 102, num: 'T02', title: 'Igualdad', progress: 100, lastAccessed: 'Hace 3 días', timeSpent: '30m', urlPdf: '/pdfs/temario_operador_c1/T02. Igualdad.pdf' },
          { id: 103, num: 'T03', title: 'PRL y EPI', progress: 50, lastAccessed: 'Hoy', timeSpent: '1h 10m', urlPdf: '/pdfs/temario_operador_c1/T03. PRL y EPI.pdf' },
          { id: 104, num: 'T04', title: 'Ley del Fuego', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T04. Ley del Fuego.pdf' },
          { id: 105, num: 'T05', title: 'SNPC', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T05. SNPC.pdf' },
          { id: 106, num: 'T06', title: 'Territorio y Red de infraestructuras de la CM', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T06. Territorio y Red de infraestructuras de la CM.pdf' },
          { id: 107, num: 'T07', title: 'Organización del CBCM', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T07. Organización del CBCM.pdf' },
          { id: 108, num: 'T08', title: 'Documento organización CECOP', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T08. Documento organización CECOP.pdf' },
          { id: 109, num: 'T09', title: 'Anexo I funcionamiento de la sala v3.0', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T09. Anexo I funcionamiento de la sala v3.0.pdf' },
          { id: 110, num: 'T10', title: 'IT.0141_TIPIFICACION de servicios CBCM', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T10. IT.0141_TIPIFICACION de servicios CBCM.pdf' },
          { id: 111, num: 'T11', title: 'PT.0137_Procedimiento CERO Activación', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T11. PT.0137_Procedimiento CERO Activación.pdf' },
          { id: 112, num: 'T12', title: 'Procedimiento ACTIVACIÓN tentativa de suicidio', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T12. procedimiento ACTIVACIÓN tentativa de suicidio.pdf' },
          { id: 113, num: 'T13', title: 'Procedimiento ACTIVACION entorno acuático', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T13. procedimiento ACTIVACION entorno acuático.pdf' },
          { id: 114, num: 'T14', title: 'PT.0117_Procedimiento Activacion Incendio Vegetacion', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T14. PT.0117_Procedimiento Activacion Incendio Vegetacion.pdf' },
          { id: 115, num: 'T15', title: 'Procedimiento Gestión de la Guardia INFOMA', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T15. Procedimiento Gestión de la Guardia INFOMA.pdf' },
          { id: 116, num: 'T16', title: 'PT.0151_Comunicaciones en Emergencias', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T16. PT.0151_Comunicaciones en Emergencias.pdf' },
          { id: 117, num: 'T17', title: 'Comunicaciones en el Servicio de Bomberos', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T17. Comunicaciones en el Servicio de Bomberos.pdf' },
          { id: 118, num: 'T18', title: 'Fundamentos de la informática', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T18. Fundamentos de la informática.pdf' },
          { id: 119, num: 'T19', title: 'SVB I', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T19. SVB I.pdf' },
          { id: 120, num: 'T20', title: 'SVB II', progress: 0, urlPdf: '/pdfs/temario_operador_c1/T20. SVB II.pdf' },
        ]
      }
    ],
    tecnico_a2: [
      {
        blockTitle: 'Bloque 1',
        temas: [
          { id: 201, num: 'I.1', title: 'Ley 39-2015 P.A.C. de las AA.PP (Parte 1)', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_1_bombero_tecnico_a2/I.1. Ley 39-2015_P.A.C. de las AA.PP.pdf' },
          { id: 202, num: 'I.2', title: 'Ley 39-2015 P.A.C. de las AA.PP (Parte 2)', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_1_bombero_tecnico_a2/I.2. Ley 39-2015_P.A.C. de las AA.PP.pdf' },
          { id: 203, num: 'I.3', title: 'EBEB. Funcion Publica', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_1_bombero_tecnico_a2/I.3. EBEB. Funcion Publica.pdf' },
          { id: 204, num: 'I.4', title: 'Ley 31-1995 de PRL', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_1_bombero_tecnico_a2/I.4. Ley 31-1995 de PRL.pdf' },
          { id: 205, num: 'I.5', title: 'Igualdad', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_1_bombero_tecnico_a2/I.5. Igualdad.pdf' },
        ]
      },
      {
        blockTitle: 'Bloque 2',
        temas: [
          { id: 206, num: 'II.6', title: 'Decreto Legislativo 1-2006', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.6. Decreto Legislativo 1-2006.pdf' },
          { id: 207, num: 'II.7', title: 'Herramientas de coordinacion internacional en catastrofes', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.7. Herramientas de coordinacion internacional en catastrofes.pdf' },
          { id: 208, num: 'II.8', title: 'Ley 17-2015 Sistma Nacional de PC', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.8. Ley 17-2015_Sistma Nacional de PC.pdf' },
          { id: 209, num: 'II.9', title: 'INFOMA 1', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.9. INFOMA_1.pdf' },
          { id: 210, num: 'II.10', title: 'INFOMA 2', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.10. INFOMA_2.pdf' },
          { id: 211, num: 'II.11', title: 'INUNCAM', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.11. INUNCAM.pdf' },
          { id: 212, num: 'II.12', title: 'RD 840.2015', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.12. RD 840.2015.pdf' },
          { id: 213, num: 'II.13', title: 'Decreto 159-2017 TRANSCAM 1', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.13. Decreto 159-2017_TRANSCAM_1.pdf' },
          { id: 214, num: 'II.14', title: 'Decreto 159-2017 TRANSCAM 2', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.14. Decreto 159-2017_TRANSCAM_2.pdf' },
          { id: 215, num: 'II.15', title: 'Plan Inclemencias Invernales', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.15. Plan Inclemencias Invernales.pdf' },
          { id: 216, num: 'II.16', title: 'CTE 1', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.16. CTE_1.pdf' },
          { id: 217, num: 'II.17', title: 'CTE 2', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.17. CTE_2.pdf' },
          { id: 218, num: 'II.18', title: 'Guia RSCIEI 1', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.18. Guia RSCIEI_1.pdf' },
          { id: 219, num: 'II.19', title: 'Guia RSCIEI 2', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.19. Guia RSCIEI_2.pdf' },
          { id: 220, num: 'II.20', title: 'Guia RSCIEI 3', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_2_bombero_tecnico_a2/II.20. Guia RSCIEI_3.pdf' },
        ]
      },
      {
        blockTitle: 'Bloque 3 (1ª Parte)',
        temas: [
          { id: 221, num: 'III.21', title: 'Incendios de interior', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.1_bombero_tecnico_a2/III.21. Incendios de interior.pdf' },
          { id: 222, num: 'III.22', title: 'Ventilación', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.1_bombero_tecnico_a2/III.22. Ventilación.pdf' },
          { id: 223, num: 'III.23', title: 'Intervencion en incendios en tuneles', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.1_bombero_tecnico_a2/III.23. Intervencion en incendios en tuneles.pdf' },
          { id: 224, num: 'III.24', title: 'Incendios Forestales', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.1_bombero_tecnico_a2/III.24. Incendios Forestales.pdf' },
          { id: 225, num: 'III.25', title: 'Accidentes de trafico', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.1_bombero_tecnico_a2/III.25. Accidentes de trafico.pdf' },
        ]
      },
      {
        blockTitle: 'Bloque 3 (2ª Parte)',
        temas: [
          { id: 226, num: 'III.26', title: 'Riesgo Químico', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.2_bombero_tecnico_a2/III.26. Riesgo Químico.pdf' },
          { id: 227, num: 'III.27', title: 'Salvamento en Estructuras Colapsadas', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.2_bombero_tecnico_a2/III.27. Salvamento en Estructuras Colapsadas.pdf' },
          { id: 228, num: 'III.28', title: 'El mando en los servicios de bomberos', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.2_bombero_tecnico_a2/III.28. El mando en los servicios de bomberos.pdf' },
          { id: 229, num: 'III.29', title: 'Los Servicios de Bomberos en la CM', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.2_bombero_tecnico_a2/III.29. Los Servicios de Bomberos en la CM.pdf' },
          { id: 230, num: 'III.30', title: 'Vehiculos de bomberos', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_3.2_bombero_tecnico_a2/III.30. Vehiculos de bomberos.pdf' },
        ]
      },
      {
        blockTitle: 'Bloque 4',
        temas: [
          { id: 231, num: 'IV.31', title: 'Hidraulica', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_4_bombero_tecnico_a2/IV.31. Hidraulica.pdf' },
          { id: 232, num: 'IV.32', title: 'Cartografia', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_4_bombero_tecnico_a2/IV.32. Cartografia.pdf' },
          { id: 233, num: 'IV.33', title: 'Construccion', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_4_bombero_tecnico_a2/IV.33. Construccion.pdf' },
          { id: 234, num: 'IV.34', title: 'Comportamiento al fuego', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_4_bombero_tecnico_a2/IV.34. Comportamiento al fuego.pdf' },
          { id: 235, num: 'IV.35', title: 'Patologia en la edificacion', progress: 0, urlPdf: '/pdfs/temario_oficial_tecnico_a2/bloque_4_bombero_tecnico_a2/IV.35. Patologia en la edificacion.pdf' },
        ]
      }
    ],
    conductor_nuevo: [
      {
        blockTitle: 'Temario Oficial Conductor',
        temas: [
          { id: 401, num: '00', title: 'Correcciones 2026', progress: 100, lastAccessed: 'Hoy', timeSpent: '15m', urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/00. Correcciones 2026.pdf' },
          { id: 402, num: '00', title: 'Introducción y epígrafes', progress: 100, lastAccessed: 'Ayer', timeSpent: '40m', urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/00. Introducción y epígrafes.pdf' },
          { id: 403, num: 'T01', title: 'La Funcion Publica', progress: 45, lastAccessed: 'Hoy, 10:30', timeSpent: '1h 25m', urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 01. La Funcion Publica_v2.pdf' },
          { id: 404, num: 'T02', title: 'Igualdad', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 02. Igualdad.pdf' },
          { id: 405, num: 'T03', title: 'PRL y EPI', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 03. PRL y EPI.pdf' },
          { id: 406, num: 'T04', title: 'DL 1 2006', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 04. DL 1 2006.pdf' },
          { id: 407, num: 'T05', title: 'SNPC', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 05. SNPC.pdf' },
          { id: 408, num: 'T06', title: 'PLATERCAM', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 06. PLATERCAM.pdf' },
          { id: 409, num: 'T07', title: 'CTE DB SI', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 07. CTE DB SI.pdf' },
          { id: 410, num: 'T08', title: 'Territorio y Red de infraestructuras de la CM', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 08. Territorio y Red de infraestructuras de la CM.pdf' },
          { id: 411, num: 'T09', title: 'Organización del CBCM', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 09. Organización del CBCM.pdf' },
          { id: 412, num: 'T10', title: 'Mecánica básica', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 10. Mecánica básica.pdf' },
          { id: 413, num: 'T11', title: 'Comunicaciones', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 11. Comunicaciones.pdf' },
          { id: 414, num: 'T12', title: 'SVB I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 12. SVB I.pdf' },
          { id: 415, num: 'T13', title: 'SVB II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 13. SVB II.pdf' },
          { id: 416, num: 'T14', title: 'Psicología para intervinientes', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 14. Psicología para intervinientes.pdf' },
          { id: 417, num: 'T15', title: 'Hidráulica', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 15. Hidráulica.pdf' },
          { id: 418, num: 'T16', title: 'Naturaleza del fuego, métodos y agentes extintores', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 16. Naturaleza del fuego, métodos de extinción y agentes extintores.pdf' },
          { id: 419, num: 'T17', title: 'Incendios en la edificación I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 17. Incendios en la edificación I.pdf' },
          { id: 420, num: 'T18', title: 'Incendios en la edificación II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 18. Incendios en la edificación II.pdf' },
          { id: 421, num: 'T19', title: 'Incendios de Vegetación I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 19. Incendios de Vegetación I.pdf' },
          { id: 422, num: 'T20', title: 'Incendios de Vegetación II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 20. Incendios de Vegetación II.pdf' },
          { id: 423, num: 'T21', title: 'RBQ I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 21. RBQ I.pdf' },
          { id: 424, num: 'T22', title: 'RBQ II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 22. RBQ II.pdf' },
          { id: 425, num: 'T23', title: 'Construcción I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 23. Construcción I.pdf' },
          { id: 426, num: 'T24', title: 'Construcción II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 24. Construcción II.pdf' },
          { id: 427, num: 'T25', title: 'RAT I', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 25. RAT I.pdf' },
          { id: 428, num: 'T26', title: 'RAT II', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 26. RAT II.pdf' },
          { id: 429, num: 'T27', title: 'Trabajos verticales', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 27. Trabajos verticales.pdf' },
          { id: 430, num: 'T28', title: 'Riesgo Eléctrico', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 28. Riesgo Eléctrico.pdf' },
          { id: 431, num: 'T29', title: 'Suministros de gas', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 29. Suministros de gas.pdf' },
          { id: 432, num: 'T30', title: 'Intervenciones con abejas', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 30. Intervenciones con abejas.pdf' },
          { id: 433, num: 'T31', title: 'Ascensores y aperturas forzosas', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 31. Ascensores y aperturas forzosas_v2.pdf' },
          { id: 434, num: 'T32', title: 'Apeos de arbolado', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 32. Apeos de arbolado.pdf' },
          { id: 435, num: 'T33', title: 'Actuación en Conductas Autolíticas', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 33. Actuación en Conductas Autolíticas.pdf' },
          { id: 436, num: 'T34', title: 'Rescate acuático', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 34. Rescate acuático.pdf' },
          { id: 437, num: 'T35', title: 'Conducción segura en emergencias', progress: 0, urlPdf: '/pdfs/temario_bombero_especialista_conductor_c1/Tema 35. Conducción segura en emergencias.pdf' }
        ]
      }
    ]
  };

  const currentPlazaData = temario[activeBlock] || [];

  useEffect(() => {
    if (currentPlazaData.length > 0) {
      setOpenBlocks({ [currentPlazaData[0].blockTitle]: true });
    } else {
      setOpenBlocks({});
    }
  }, [activeBlock]);

  const toggleBlock = (title) => {
    setOpenBlocks(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const formatLastAccessed = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Hace segundos';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hoy, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (diffDays === 1) return `Ayer, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    return `${date.toLocaleDateString()}`;
  };

  const formatTimeSpent = (totalSeconds) => {
    if (!totalSeconds) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return '< 1m';
  };

  const abrirPDF = (temaId, title, url) => {
    if(url) {
      setViewerData({
        id: temaId,
        title: title,
        url: encodeURI(url),
        startTime: Date.now()
      });
      document.body.style.overflow = 'hidden';
    } else {
      alert("El PDF de este tema se está actualizando y estará disponible pronto.");
    }
  };

  const cerrarPDF = () => {
    if (!viewerData || !user) {
      setViewerData(null);
      document.body.style.overflow = 'auto';
      return;
    }

    const sessionSeconds = Math.floor((Date.now() - viewerData.startTime) / 1000);
    const prevSeconds = userProgress[viewerData.id]?.timeSpentSeconds || 0;
    const newTotalSeconds = prevSeconds + sessionSeconds;
    
    const updatedProgress = {
      ...userProgress,
      [viewerData.id]: {
        lastAccessed: new Date().toISOString(),
        timeSpentSeconds: newTotalSeconds,
        clicks: (userProgress[viewerData.id]?.clicks || 0) + 1
      }
    };
    
    setUserProgress(updatedProgress);
    
    localStorage.setItem(`yoopo_user_progress_${user.uid}`, JSON.stringify(updatedProgress));

    setViewerData(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col font-sans selection:bg-[#E1B143] selection:text-black relative">
      
      <header className="w-full border-b border-white/10 bg-[#0A0F1C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img
              src={imagenLogoBlanco}
              alt="Yoopo"
              className="h-8 cursor-pointer hover:opacity-80 transition-opacity hidden md:block"
              onClick={() => navigate('/')}
            />
            <button
              onClick={() => navigate('/estudio')}
              className="flex items-center gap-2 text-white/50 hover:text-[#E1B143] transition font-black uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-lg"
            >
              <HiOutlineArrowLeft size={16} /> Volver a Estudio
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-white/40 uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <HiOutlineFire className="text-amber-400" />
              Biblioteca Central
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 md:gap-4 pl-4 border-l border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#E1B143] font-black">Conectado</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1">{userName}</span>
                </div>
                <div onClick={() => navigate('/perfil')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E1B143] to-[#b88d2d] flex items-center justify-center text-[#1A233A] font-black text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg">
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-10 lg:py-16 flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">        
        
        <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-4 pl-2">
            <div className="w-2 h-2 rounded bg-[#E1B143] animate-pulse"></div>
            <h2 className="text-xs font-black text-white/40 tracking-[0.2em] uppercase">Selecciona tu Plaza</h2>
          </div>
          
          {plazas.map((plaza) => (
            <button
              key={plaza.id}
              onClick={() => setActiveBlock(plaza.id)}
              className={`text-left px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide border ${
                activeBlock === plaza.id 
                  ? 'bg-[#E1B143] text-black border-[#E1B143] shadow-[0_0_20px_rgba(225,177,67,0.2)]' 
                  : 'bg-[#141B2D] text-white/60 border-white/5 hover:bg-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {plaza.title}
            </button>
          ))}
        </aside>

        <section className="w-full lg:w-3/4 xl:w-4/5 flex flex-col overflow-hidden">
          
          <div className="flex flex-col mb-10 pb-6 border-b border-white/10">
             <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-[#E1B143] mb-4 drop-shadow-md">
               {plazas.find(p => p.id === activeBlock)?.title}
             </h1>
             <p className="text-white/50 text-base md:text-xl font-medium w-full break-words">
               Navega por los bloques oficiales. Haz clic en el panel para desplegar los temas y pulsa sobre cualquier fila para visualizar tu PDF.
             </p>
          </div>

          <div className="flex flex-col gap-6 mb-20 w-full">
            {currentPlazaData.length > 0 ? currentPlazaData.map((bloque, index) => {
              const isOpen = openBlocks[bloque.blockTitle];
              
              return (
                <div key={index} className={`bg-[#141B2D] border rounded-2xl overflow-hidden transition-all duration-500 w-full ${isOpen ? 'border-[#E1B143]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/5'}`}>
                  
                  <div 
                    onClick={() => toggleBlock(bloque.blockTitle)}
                    className={`px-6 md:px-8 py-6 cursor-pointer flex justify-between items-center transition-colors w-full ${isOpen ? 'bg-gradient-to-r from-[#1a233a] to-[#141B2D]' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`p-3 rounded-xl transition-colors shrink-0 ${isOpen ? 'bg-[#E1B143]/10 text-[#E1B143]' : 'bg-white/5 text-white/30'}`}>
                         <HiOutlineDocumentText size={28} />
                      </div>
                      <h3 className={`text-xl md:text-2xl font-black uppercase italic tracking-tight transition-colors truncate ${isOpen ? 'text-white' : 'text-white/60'}`}>
                        {bloque.blockTitle}
                      </h3>
                    </div>
                    
                    <div className={`transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'text-[#E1B143] rotate-180' : 'text-white/30'}`}>
                      <HiOutlineChevronDown size={28} />
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ease-in-out w-full ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-4 md:p-8 flex flex-col gap-4 border-t border-white/5 bg-[#0A0F1C]/40 w-full">
                      {bloque.temas.map((tema) => {
                        
                        const progressData = userProgress[tema.id];
                        const hasBeenOpened = !!progressData;
                        const lastAccessedText = formatLastAccessed(progressData?.lastAccessed);
                        const timeSpentText = formatTimeSpent(progressData?.timeSpentSeconds);

                        return (
                          <div 
                            key={tema.id} 
                            onClick={() => abrirPDF(tema.id, tema.title, tema.urlPdf)}
                            className="bg-[#141B2D] border border-transparent rounded-xl p-5 md:p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between hover:bg-[#1a233a] hover:border-[#E1B143]/40 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer group w-full box-border"
                          >
                            <div className="flex-1 min-w-0 max-w-full">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="bg-black/50 border border-white/10 text-white px-3 py-1.5 text-xs font-black tracking-widest uppercase flex items-center gap-2 group-hover:border-[#E1B143]/30 transition-colors shrink-0 rounded-md">
                                  <span className="w-2 h-2 rounded-xl bg-[#E1B143]"></span>
                                  {tema.num}
                                </span>
                                
                                {hasBeenOpened ? (
                                  <span className="flex items-center gap-2 text-white/70 text-xs font-bold tracking-wide bg-white/5 px-3 py-1.5 rounded-md border border-white/10 shrink-0">
                                    <HiOutlineClock size={16} className="text-[#E1B143] shrink-0" />
                                    <span className="truncate">Visto {lastAccessedText}</span>
                                    <span className="text-white/20">|</span>
                                    <span className="truncate">Estudiado: <strong className="text-[#E1B143]">{timeSpentText}</strong></span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-white/30 text-xs font-medium tracking-wide bg-black/30 px-3 py-1.5 rounded-md border border-white/5 shrink-0">
                                    Sin empezar
                                  </span>
                                )}

                              </div>
                              <h4 className="text-lg md:text-xl font-bold leading-relaxed group-hover:text-[#E1B143] transition-colors pr-4 break-words hyphens-auto">
                                {tema.title}
                              </h4>
                            </div>

                            <div className="flex flex-row items-center justify-start lg:justify-end w-full lg:w-auto gap-4 shrink-0 mt-2 lg:mt-0">
                              <div className="flex items-center gap-2 text-[#E1B143] text-xs font-black uppercase tracking-widest lg:opacity-0 group-hover:opacity-100 transition-all lg:translate-x-4 group-hover:translate-x-0 bg-[#E1B143]/10 px-4 py-2.5 rounded-lg whitespace-nowrap">
                                Abrir PDF <HiOutlineExternalLink size={18} className="shrink-0" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            }) : (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center w-full">
                <h3 className="text-2xl font-bold text-white/50 mb-3">Contenido en revisión</h3>
                <p className="text-white/30 font-medium text-lg max-w-lg">Los apuntes de esta categoría se están estructurando y estarán disponibles en la próxima actualización.</p>
              </div>
            )}
          </div>

        </section>
      </main>

      <footer className="w-full bg-[#050810] text-white/30 pt-16 pb-10 border-t border-white/5 mt-auto">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 text-center md:text-left">
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

      {viewerData && (
        <div className="fixed inset-0 z-[100] bg-[#050810] flex flex-col">
          
          <div className="h-16 md:h-20 bg-[#141B2D] border-b border-[#E1B143]/30 flex items-center justify-between px-4 md:px-8 shadow-2xl shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-3 bg-[#E1B143]/10 text-[#E1B143] rounded-xl hidden md:block shrink-0">
                <HiOutlineDocumentText size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-white font-bold text-base md:text-xl leading-tight truncate max-w-[200px] md:max-w-2xl">{viewerData.title}</h3>
                <span className="text-[#E1B143] text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 mt-1 shrink-0">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Registrando tiempo de estudio
                </span>
              </div>
            </div>
            
            <button 
              onClick={cerrarPDF}
              className="flex items-center justify-center gap-2 bg-[#E1B143] hover:bg-white text-black px-6 py-3 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(225,177,67,0.3)] hover:shadow-white/20 shrink-0"
            >
              <span className="hidden md:block">Cerrar y Guardar</span>
              <span className="block md:hidden">Cerrar</span>
              <HiOutlineX size={20} className="shrink-0" />
            </button>
          </div>

          <div className="flex-grow w-full h-full relative bg-[#0A0F1C]">
            <iframe 
              src={`${viewerData.url}#toolbar=0&navpanes=0`} 
              className="absolute inset-0 w-full h-full border-none"
              title="Visor PDF Yoopo"
            />
          </div>

        </div>
      )}

    </div>
  );
}