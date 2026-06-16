import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { listarMeusEventos, inscricoesDoEvento, encerrarEvento } from '../services/api';
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

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </svg>
  );
}

export default function MeusEventos() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [contadores, setContadores] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [confirmEncerrar, setConfirmEncerrar] = useState(null);
  const [encerrando, setEncerrando] = useState(false);

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

  const handleEncerrar = async () => {
    if (!confirmEncerrar) return;
    setEncerrando(true);
    try {
      await encerrarEvento(confirmEncerrar.id);
      setEventos(prev =>
        prev.map(ev => ev.id === confirmEncerrar.id ? { ...ev, status: 'ENCERRADO' } : ev)
      );
      setConfirmEncerrar(null);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao encerrar evento';
      setErroGeral(msg);
    } finally {
      setEncerrando(false);
    }
  };

  const formatData = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).split('T')[0];
    const [year, month, day] = clean.split('-');
    return `${day}/${month}/${year}`;
  };

  const getBadgeClass = (evento) => {
    if (evento.status === 'ENCERRADO') return 'encerrado';
    return evento.vagas > 0 ? 'aberto' : 'completo';
  };

  const getBadgeLabel = (evento) => {
    if (evento.status === 'ENCERRADO') return 'Encerrado';
    return evento.vagas > 0 ? 'Aberto' : 'Completo';
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
              const encerrado = evento.status === 'ENCERRADO';
              const cnt = contadores[evento.id] || { total: 0, pendentes: 0 };
              return (
                <div key={evento.id} className={`evento-list-item${encerrado ? ' encerrado' : ''}`}>
                  <div className="evento-list-info">
                    <div className="evento-list-title-row">
                      <h3 className="evento-list-title">{evento.titulo}</h3>
                      <span className={`evento-status-badge ${getBadgeClass(evento)}`}>
                        {getBadgeLabel(evento)}
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
                    {encerrado ? (
                      <>
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
                        <button
                          className="btn-evento-action purple"
                          onClick={() => navigate(`/evento/${evento.id}/avaliacoes`)}
                        >
                          <StarIcon /> Avaliações
                        </button>
                      </>
                    ) : (
                      <>
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
                        <button
                          className="btn-evento-action purple"
                          onClick={() => navigate(`/evento/${evento.id}/avaliacoes`)}
                        >
                          <StarIcon /> Avaliações
                        </button>
                        <button
                          className="btn-evento-action red"
                          onClick={() => setConfirmEncerrar(evento)}
                        >
                          <StopIcon /> Encerrar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de confirmação de encerramento */}
        {confirmEncerrar && (
          <div className="modal-overlay" onClick={() => !encerrando && setConfirmEncerrar(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Encerrar Evento</h2>
              <p className="modal-desc">
                Tem certeza que deseja encerrar <strong>"{confirmEncerrar.titulo}"</strong>?
              </p>
              <p className="modal-aviso">
                O evento ficará visível como histórico e não aceitará novas inscrições.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-modal-cancelar"
                  onClick={() => setConfirmEncerrar(null)}
                  disabled={encerrando}
                >
                  Cancelar
                </button>
                <button
                  className="btn-modal-confirmar"
                  onClick={handleEncerrar}
                  disabled={encerrando}
                >
                  {encerrando ? 'Encerrando...' : 'Sim, encerrar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
