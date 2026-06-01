import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { minhasInscricoes, listarMeusEventos, listarEventos, inscricoesDoEvento } from '../services/api';
import { calcularCompatibilidade } from '../utils/compatibilidade';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [inscricoes, setInscricoes] = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);
  const [eventosRecomendados, setEventosRecomendados] = useState([]);
  const [eventosParaAprovar, setEventosParaAprovar] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loginMsg = sessionStorage.getItem('loginSucesso');
    if (loginMsg) {
      setToast(loginMsg);
      sessionStorage.removeItem('loginSucesso');
      setTimeout(() => setToast(''), 3000);
    }
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [inscRes, eventosRes, todosRes] = await Promise.all([
        minhasInscricoes().catch(() => ({ data: [] })),
        listarMeusEventos().catch(() => ({ data: [] })),
        listarEventos().catch(() => ({ data: [] })),
      ]);

      setInscricoes(inscRes.data);
      setMeusEventos(eventosRes.data);

      const recomendados = todosRes.data
        .filter(e => e.criadorId !== usuario.id)
        .map(e => ({ ...e, compatibilidade: calcularCompatibilidade(usuario, e) }))
        .sort((a, b) => b.compatibilidade - a.compatibilidade)
        .slice(0, 3);
      setEventosRecomendados(recomendados);

      if (eventosRes.data.length > 0) {
        const inscPorEvento = await Promise.all(
          eventosRes.data.slice(0, 5).map(ev =>
            inscricoesDoEvento(ev.id)
              .then(r => ({ evento: ev, inscricoes: r.data }))
              .catch(() => ({ evento: ev, inscricoes: [] }))
          )
        );
        const comPendentes = inscPorEvento
          .map(({ evento, inscricoes }) => ({
            evento,
            pendentes: inscricoes.filter(i => i.status === 'PENDENTE').length,
          }))
          .filter(({ pendentes }) => pendentes > 0);
        setEventosParaAprovar(comPendentes);
      }
    } catch {
      // silencia erros não críticos
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

  const inscricoesPendentes = inscricoes.filter(i => i.status === 'PENDENTE');
  const inscricoesAprovadas = inscricoes.filter(i => i.status === 'CONFIRMADA');

  const IconInscricoes = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  );

  const IconEventos = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const IconAprovados = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );

  const IconComprovantes = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );

  const stats = [
    { label: 'Inscrições', valor: inscricoes.length, icon: <IconInscricoes /> },
    { label: 'Eventos criados', valor: meusEventos.length, icon: <IconEventos /> },
    { label: 'Aprovados', valor: inscricoesAprovadas.length, icon: <IconAprovados /> },
    { label: 'Comprovantes', valor: inscricoesAprovadas.length, icon: <IconComprovantes /> },
  ];

  const primeiroNome = (usuario.nome || 'Voluntário').split(' ')[0];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main dashboard-main">
        <div className="dashboard-header">
          <h1>Olá, {primeiroNome}!{' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle'}}>
              <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>
              <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>
              <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
            </svg>
          </h1>
          <p className="dashboard-subtitle">Veja o resumo das suas atividades no GoodDeeds.</p>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <div className="stat-valor">{carregando ? '…' : s.valor}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-col-main">
            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Inscrições Pendentes</h2>
              </div>
              {carregando ? (
                <p className="dash-loading">Carregando...</p>
              ) : inscricoesPendentes.length === 0 ? (
                <p className="dash-empty">Nenhuma inscrição pendente</p>
              ) : (
                <div className="inscricoes-pendentes-list">
                  {inscricoesPendentes.slice(0, 3).map(i => (
                    <div key={i.id} className="inscricao-pendente-item" onClick={() => navigate(`/evento/${i.evento_id}`)}>
                      <div className="inscricao-pendente-info">
                        <span className="inscricao-pendente-titulo">{i.titulo}</span>
                        <span className="inscricao-pendente-meta">
                          {formatData(i.data)} • {i.cidade}
                        </span>
                      </div>
                      <span className="badge-pendente">Pendente</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="dash-link" onClick={() => navigate('/minhas-inscricoes')}>
                Ver todas →
              </button>
            </div>

            {eventosParaAprovar.length > 0 && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Inscrições para aprovar</h2>
                </div>
                <div className="aprovar-list">
                  {eventosParaAprovar.map(({ evento, pendentes }) => (
                    <div
                      key={evento.id}
                      className="aprovar-item"
                      onClick={() => navigate(`/evento/${evento.id}/inscricoes`)}
                    >
                      <div className="aprovar-info">
                        <span className="aprovar-titulo">{evento.titulo}</span>
                        <span className="aprovar-count">{pendentes} inscrição pendente</span>
                      </div>
                      <span className="aprovar-arrow">→</span>
                    </div>
                  ))}
                </div>
                <button className="dash-link" onClick={() => navigate('/meus-eventos')}>
                  Gerenciar eventos →
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-col-side">
            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Eventos Recomendados</h2>
              </div>
              {carregando ? (
                <p className="dash-loading">Carregando...</p>
              ) : eventosRecomendados.length === 0 ? (
                <p className="dash-empty">Nenhum evento disponível</p>
              ) : (
                <div className="recomendados-list">
                  {eventosRecomendados.map(ev => (
                    <div key={ev.id} className="recomendado-item" onClick={() => navigate(`/evento/${ev.id}`)}>
                      <div className="recomendado-info">
                        <span className="recomendado-titulo">{ev.titulo}</span>
                        <span className="recomendado-meta">{formatData(ev.data)} • {ev.cidade}</span>
                      </div>
                      <span className="recomendado-pct">{ev.compatibilidade}%</span>
                    </div>
                  ))}
                </div>
              )}
              <button className="dash-link" onClick={() => navigate('/explorar-eventos')}>
                Ver todos os eventos →
              </button>
            </div>
          </div>
        </div>

        {toast && (
          <div className="toast-sucesso">
            ✓ {toast}
          </div>
        )}
      </main>
    </div>
  );
}
