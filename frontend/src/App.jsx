import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CriarEvento from './pages/CriarEvento';
import ExplorarEventos from './pages/ExplorarEventos';
import DetalhesEvento from './pages/DetalhesEvento';
import MeusEventos from './pages/MeusEventos';
import EditarEvento from './pages/EditarEvento';
import MinhasInscricoes from './pages/MinhasInscricoes';
import GerenciarInscricoes from './pages/GerenciarInscricoes';
import ControlePresenca from './pages/ControlePresenca';
import Comprovantes from './pages/Comprovantes';
import MeuPerfil from './pages/MeuPerfil';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/criar-evento" element={<CriarEvento />} />
        <Route path="/explorar-eventos" element={<ExplorarEventos />} />
        <Route path="/evento/:id" element={<DetalhesEvento />} />
        <Route path="/meus-eventos" element={<MeusEventos />} />
        <Route path="/evento/:id/editar" element={<EditarEvento />} />
        <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
        <Route path="/evento/:id/inscricoes" element={<GerenciarInscricoes />} />
        <Route path="/evento/:id/presenca" element={<ControlePresenca />} />
        <Route path="/comprovantes" element={<Comprovantes />} />
        <Route path="/perfil" element={<MeuPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}
