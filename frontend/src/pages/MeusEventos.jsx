import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { listarMeusEventos, inscricoesDoEvento } from '../services/api';
import './MeusEventos.css';

function EditarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function MeusEventos() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [contadores, setContadores] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    carregarMeusEventos();
  }, []);

  const carregarMeusEventos = async () => {
    setCarregando(true);
    setErroGeral('');
    try {
      const response = await listarMeusEventos();
      const evs = response.data;
      setEventos(evs);

      const counts = {};
      await Promise.all(
        evs.map(ev =>
          inscricoesDoEvento(ev.id)
            .then(r => {
              const total = r.data.length;
              const pendentes = r.data.filter(i => i.status === 'PENDENTE').length;
              counts[ev.id] = { total, pendentes };
            })
            .catch(() => { counts[ev.id] = { total: 0, pendentes: 0 }; })
        )
      );
      setContadores(counts);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar seus eventos';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const formatData = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).split('T')[0];
    const [year, month, day] = clean.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main meus-eventos-main">
        <div className="meus-eventos-header">
          <h1>Meus Eventos</h1>
          <button className="btn-criar-evento" onClick={() => navigate('/criar-evento')}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Criar Evento
          </button>
        </div>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        {carregando ? (
          <div className="loading-state"><p>Carregando seus eventos...</p></div>
        ) : eventos.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não criou nenhum evento</p>
            <p style={{ fontSize: '0.9rem', color: '#67737e' }}>
              Clique em "Criar Evento" para começar a anunciar oportunidades de voluntariado
            </p>
            <button className="btn-criar-evento" onClick={() => navigate('/criar-evento')}>
              Criar Meu Primeiro Evento
            </button>
          </div>
        ) : (
          <div className="eventos-list">
            {eventos.map(evento => {
              const temVagas = evento.vagas > 0;
              const cnt = contadores[evento.id] || { total: 0, pendentes: 0 };
              return (
                <div key={evento.id} className="evento-list-item">
                  <div className="evento-list-info">
                    <div className="evento-list-title-row">
                      <h3 className="evento-list-title">{evento.titulo}</h3>
                      <span className={`evento-status-badge ${temVagas ? 'aberto' : 'completo'}`}>
                        {temVagas ? 'Aberto' : 'Completo'}
                      </span>
                    </div>
                    <p className="evento-list-meta">
                      {formatData(evento.data)} • {evento.cidade} • {evento.vagas} vagas
                    </p>
                    {cnt.total > 0 && (
                      <p className="evento-list-inscricoes">
                        {cnt.total} inscrição{cnt.total !== 1 ? 'ões' : ''}
                        {cnt.pendentes > 0 && (
                          <span className="inscricoes-pendente-count"> {cnt.pendentes} pendente{cnt.pendentes !== 1 ? 's' : ''}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="evento-list-actions">
                    <button
                      className="btn-evento-action outline"
                      onClick={() => navigate(`/evento/${evento.id}/editar`)}
                    >
                      <EditarIcon /> Editar
                    </button>
                    <button
                      className="btn-evento-action green"
                      onClick={() => navigate(`/evento/${evento.id}/inscricoes`)}
                    >
                      <PeopleIcon /> Inscrições
                    </button>
                    <button
                      className="btn-evento-action blue"
                      onClick={() => navigate(`/evento/${evento.id}/presenca`)}
                    >
                      <CheckIcon /> Presença
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
