import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { inscricoesDoEvento, obterEvento, aprovarInscricao, recusarInscricao } from '../services/api';
import { calcularCompatibilidade } from '../utils/compatibilidade';
import './GerenciarInscricoes.css';

export default function GerenciarInscricoes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [evento, setEvento] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [processando, setProcessando] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [eventoRes, inscricoesRes] = await Promise.all([
        obterEvento(id),
        inscricoesDoEvento(id),
      ]);

      setEvento(eventoRes.data);
      setInscricoes(inscricoesRes.data);
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar dados';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleAprovar = async (inscricaoId) => {
    setProcessando(inscricaoId);
    try {
      await aprovarInscricao(inscricaoId);
      setInscricoes(prev =>
        prev.map(i => i.id === inscricaoId ? { ...i, status: 'CONFIRMADA' } : i)
      );
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao aprovar';
      setErroGeral(msg);
    } finally {
      setProcessando(null);
    }
  };

  const handleRecusar = async (inscricaoId) => {
    setProcessando(inscricaoId);
    try {
      await recusarInscricao(inscricaoId);
      setInscricoes(prev =>
        prev.map(i => i.id === inscricaoId ? { ...i, status: 'CANCELADA' } : i)
      );
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao recusar';
      setErroGeral(msg);
    } finally {
      setProcessando(null);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      'PENDENTE': { color: '#ff9800', label: 'Pendente' },
      'CONFIRMADA': { color: '#2e9e6a', label: 'Aprovado' },
      'CANCELADA': { color: '#f44336', label: 'Recusado' },
    };
    return config[status] || { color: '#666', label: status };
  };

  const inscrFiltradas = filtroStatus === 'todos'
    ? inscricoes
    : inscricoes.filter(i => i.status === filtroStatus);

  const contadores = {
    pendentes: inscricoes.filter(i => i.status === 'PENDENTE').length,
    aprovados: inscricoes.filter(i => i.status === 'CONFIRMADA').length,
    recusados: inscricoes.filter(i => i.status === 'CANCELADA').length,
  };

  if (carregando) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main gerenciar-inscricoes-main">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="gerenciar-header">
          <div>
            <h1>Gerenciar Inscrições</h1>
            {evento && <p className="gerenciar-subtitle">{evento.titulo}</p>}
          </div>
          {contadores.pendentes > 0 && (
            <button
              className="btn-aprovar-todas"
              onClick={async () => {
                const pendentes = inscricoes.filter(i => i.status === 'PENDENTE');
                for (const i of pendentes) await handleAprovar(i.id);
              }}
            >
              ✓ Aprovar todas ({contadores.pendentes})
            </button>
          )}
        </div>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        <div className="contadores-section">
          <div className="contador-card">
            <div className="contador-numero">{contadores.pendentes}</div>
            <div className="contador-label">Pendentes</div>
          </div>
          <div className="contador-card">
            <div className="contador-numero">{contadores.aprovados}</div>
            <div className="contador-label">Aprovados</div>
          </div>
          <div className="contador-card">
            <div className="contador-numero">{contadores.recusados}</div>
            <div className="contador-label">Recusados</div>
          </div>
        </div>

        {inscricoes.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma inscrição para este evento</p>
          </div>
        ) : (
          <>
            <div className="filtros-section">
              <button
                className={`filtro-btn ${filtroStatus === 'todos' ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
              </button>
              <button
                className={`filtro-btn ${filtroStatus === 'PENDENTE' ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus('PENDENTE')}
              >
                Pendentes
              </button>
              <button
                className={`filtro-btn ${filtroStatus === 'CONFIRMADA' ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus('CONFIRMADA')}
              >
                Aprovados
              </button>
              <button
                className={`filtro-btn ${filtroStatus === 'CANCELADA' ? 'ativo' : ''}`}
                onClick={() => setFiltroStatus('CANCELADA')}
              >
                Recusados
              </button>
            </div>

            <div className="inscricoes-list">
              {inscrFiltradas.map(inscricao => {
                const compatibilidade = calcularCompatibilidade(
                  { habilidades: inscricao.habilidades || [], areas_interesse: inscricao.areas_interesse || [], cidade: inscricao.cidade },
                  evento
                );
                const statusConfig = getStatusConfig(inscricao.status);

                return (
                  <div key={inscricao.id} className="inscricao-item">
                    <div className="inscricao-item-main">
                      <div className="voluntario-avatar">
                        {inscricao.nome?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="inscricao-item-info">
                        <h3>{inscricao.nome}</h3>
                        <p className="voluntario-email">{inscricao.email}</p>
                        {inscricao.habilidades && inscricao.habilidades.length > 0 && (
                          <div className="voluntario-skills">
                            {inscricao.habilidades.map(skill => (
                              <span key={skill} className="skill-badge">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {inscricao.cidade && (
                          <p className="voluntario-city">📍 {inscricao.cidade}</p>
                        )}
                      </div>
                    </div>

                    <div className="inscricao-item-compatibilidade">
                      <div className="compatibilidade-box">
                        <div className="compatibilidade-percentual">{compatibilidade}%</div>
                        <div className="compatibilidade-label">Compatível</div>
                      </div>
                    </div>

                    <div className="inscricao-item-status">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    {inscricao.status === 'PENDENTE' && (
                      <div className="inscricao-item-actions">
                        <button
                          className="btn-aprovar"
                          onClick={() => handleAprovar(inscricao.id)}
                          disabled={processando === inscricao.id}
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          className="btn-recusar"
                          onClick={() => handleRecusar(inscricao.id)}
                          disabled={processando === inscricao.id}
                        >
                          ✕ Recusar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
