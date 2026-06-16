import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { historicoParticipacoes, verificarAvaliacao } from '../services/api';
import './HistoricoParticipacoes.css';

export default function HistoricoParticipacoes() {
  const navigate = useNavigate();

  const [participacoes, setParticipacoes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await historicoParticipacoes();
      setParticipacoes(data);

      const checks = await Promise.all(
        data.map(p =>
          verificarAvaliacao(p.evento_id)
            .then(r => ({ id: p.evento_id, jaAvaliou: r.data.jaAvaliou }))
            .catch(() => ({ id: p.evento_id, jaAvaliou: false }))
        )
      );
      const map = {};
      checks.forEach(c => { map[c.id] = c.jaAvaliou; });
      setAvaliacoes(map);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar histórico');
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
      <main className="app-main historico-main">
        <h1>Histórico de Participações</h1>

        {erro && <div className="alert alert-erro">{erro}</div>}

        {carregando ? (
          <div className="loading-state"><p>Carregando histórico...</p></div>
        ) : participacoes.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem participações confirmadas</p>
            <p className="empty-state-sub">
              Após ter sua presença confirmada em um evento, ele aparecerá aqui
            </p>
            <button className="btn-explorar" onClick={() => navigate('/explorar-eventos')}>
              Explorar Eventos
            </button>
          </div>
        ) : (
          <div className="historico-container">
            {participacoes.map(p => (
              <div key={p.id} className="historico-card">
                <div className="historico-card-header">
                  <h3>{p.titulo}</h3>
                  <span className="badge-presenca">Presença Confirmada</span>
                </div>

                <div className="historico-info">
                  <div className="info-row">
                    <span className="info-icon">📅</span>
                    <span className="info-text">{formatData(p.data)}</span>
                  </div>
                  {p.horario && (
                    <div className="info-row">
                      <span className="info-icon">⏰</span>
                      <span className="info-text">{p.horario}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{p.local}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">🏷️</span>
                    <span className="info-text">{p.categoria}</span>
                  </div>
                </div>

                <div className="historico-actions">
                  <button
                    className="btn-historico btn-comprovante"
                    onClick={() => navigate('/comprovantes')}
                  >
                    Ver Comprovante
                  </button>

                  {avaliacoes[p.evento_id] ? (
                    <span className="avaliacao-enviada">✓ Avaliação enviada</span>
                  ) : (
                    <button
                      className="btn-historico btn-avaliar"
                      onClick={() => navigate(`/avaliar-evento/${p.evento_id}`)}
                    >
                      Avaliar Evento
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
