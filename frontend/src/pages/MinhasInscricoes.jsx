import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { minhasInscricoes, cancelarInscricao } from '../services/api';
import { calcularCompatibilidade } from '../utils/compatibilidade';
import './MinhasInscricoes.css';

export default function MinhasInscricoes() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    carregarInscricoes();
  }, []);

  const carregarInscricoes = async () => {
    setCarregando(true);
    setErroGeral('');
    try {
      const response = await minhasInscricoes();
      setInscricoes(response.data);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar inscrições';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = async (inscricaoId) => {
    setCancelando(inscricaoId);
    try {
      await cancelarInscricao(inscricaoId);
      setInscricoes(prev => prev.filter(i => i.id !== inscricaoId));
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao cancelar inscrição';
      setErroGeral(msg);
    } finally {
      setCancelando(null);
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

  const formatData = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).split('T')[0];
    const [year, month, day] = clean.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main minhas-inscricoes-main">
        <h1>Minhas Inscrições</h1>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        {carregando ? (
          <div className="loading-state">
            <p>Carregando inscrições...</p>
          </div>
        ) : inscricoes.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não se inscreveu em nenhum evento</p>
            <p className="empty-state-sub">
              Visite "Explorar Eventos" para descobrir oportunidades de voluntariado
            </p>
            <button
              className="btn-explorar"
              onClick={() => navigate('/explorar-eventos')}
            >
              Explorar Eventos
            </button>
          </div>
        ) : (
          <div className="inscricoes-container">
            {inscricoes.map(inscricao => {
              const compatibilidade = calcularCompatibilidade(usuario, {
                habilidades: [],
                cidade: inscricao.cidade,
                categoria: inscricao.categoria,
              });
              const statusConfig = getStatusConfig(inscricao.status);

              return (
                <div key={inscricao.id} className="inscricao-card">
                  <div className="inscricao-header">
                    <div className="inscricao-title-section">
                      <h3>{inscricao.titulo}</h3>
                      <span
                        className="inscricao-status"
                        style={{ backgroundColor: statusConfig.color }}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="inscricao-info">
                    <div className="info-row">
                      <span className="info-icon">📅</span>
                      <span className="info-text">{formatData(inscricao.data)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">⏰</span>
                      <span className="info-text">{inscricao.horario}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">📍</span>
                      <span className="info-text">{inscricao.local}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">🏷️</span>
                      <span className="info-text">{inscricao.categoria}</span>
                    </div>
                  </div>

                  <div className="inscricao-compatibility">
                    <span className="compatibility-label">{compatibilidade}% compatível</span>
                  </div>

                  <div className="inscricao-actions">
                    <button
                      className="btn-inscricao btn-ver"
                      onClick={() => navigate(`/evento/${inscricao.evento_id}`)}
                    >
                      Ver Evento
                    </button>
                    {inscricao.status === 'PENDENTE' && (
                      <button
                        className="btn-inscricao btn-cancelar"
                        onClick={() => handleCancelar(inscricao.id)}
                        disabled={cancelando === inscricao.id}
                      >
                        {cancelando === inscricao.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
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
