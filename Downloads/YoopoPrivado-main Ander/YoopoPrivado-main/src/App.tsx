import { Routes, Route } from 'react-router-dom';

import { PomodoroProvider } from './context/PomodoroContext';

import ProtectedRoute from './components/ProtectedRoute';

import InicioPage from './pages/Inicio/InicioPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import PerfilPage from './pages/Perfil/PerfilPage';

import ComunidadPage from './pages/Comunidad/ComunidadPage';
import EstudioPage from './pages/Estudio/EstudioPage';
import RankingPage from './pages/Ranking/RankingPage';
import AjustesPage from './pages/Perfil/AjustesPage';
import SobreNosotros from './pages/Inicio/SobreNosotros';
import ApuntesPage from './pages/Estudio/Apuntes';
import TestPage from './pages/Estudio/Test';
import FlashCardsPage from './pages/Estudio/FlashCards';
import PomodoroPage from './pages/Estudio/Pomodoro';
import ProximamentePage from './pages/Proximamente/ProximamentePage';
import TestEjecucionPage from './pages/Estudio/TestEjecucion';
import TestResultadosPage from './pages/Estudio/TestResultados';

function App() {
  return (
    <PomodoroProvider>
      <Routes>

        <Route path="/" element={<InicioPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

    

        <Route
          path="/comunidad"
          element={
            <ProtectedRoute>
              <ComunidadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estudio"
          element={
            <ProtectedRoute>
              <EstudioPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <RankingPage />
            </ProtectedRoute>
          }
        />

   <Route
  path="/perfil"
  element={
    <ProtectedRoute>
      <PerfilPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/ajustes"
  element={
    <ProtectedRoute>
      <AjustesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/nosotros"
  element=
  {<ProtectedRoute>
      <SobreNosotros />
    </ProtectedRoute>}
/>

<Route
  path="/apuntes"
  element={
    <ProtectedRoute>
      <ApuntesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/test"
  element={
    <ProtectedRoute>
      <TestPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/flashcards"
  element={
    <ProtectedRoute>
      <FlashCardsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/pomodoro"
  element={
    <ProtectedRoute>
      <PomodoroPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/proximamente"
  element={<ProximamentePage />}
/>


<Route
  path="/test/ejecucion"
  element={
    <ProtectedRoute>
      <TestEjecucionPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/test/resultados"
  element={
    <ProtectedRoute>
      <TestResultadosPage />
    </ProtectedRoute>
  }
/>


      </Routes>
    </PomodoroProvider>
  );
}

export default App;