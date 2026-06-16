import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { minhasAvaliacoes } from '../services/api';
import './MinhasAvaliacoes.css';

function EstrelasDisplay({ valor }) {
  return (
    <span className="estrelas-display">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= valor ? 'estrela ativa' : 'estrela'}>★</span>
      ))}
      <span className="estrela-valor">{valor}/5</span>
    </span>
  );
}

export default function MinhasAvaliacoes() {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await minhasAvaliacoes();
      setAvaliacoes(data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar avaliações');
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

  const mediaGeral = (av) => {
    const soma = av.organizacaoNota + av.comunicacaoNota + av.clarezaNota + av.experienciaNota;
    return (soma / 4).toFixed(1);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main minhas-avaliacoes-main">
        <h1>Minhas Avaliações</h1>

        {erro && <div className="alert alert-erro">{erro}</div>}

        {carregando ? (
          <div className="loading-state"><p>Carregando avaliações...</p></div>
        ) : avaliacoes.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não avaliou nenhum evento</p>
            <p className="empty-state-sub">
              Após participar de um evento, acesse o Histórico de Participações para avaliá-lo
            </p>
            <button className="btn-explorar" onClick={() => navigate('/historico')}>
              Ver Histórico
            </button>
          </div>
        ) : (
          <div className="avaliacoes-container">
            {avaliacoes.map(av => (
              <div key={av.id} className="avaliacao-card">
                <div className="avaliacao-card-header">
                  <div>
                    <h3>{av.eventoTitulo}</h3>
                    <span className="avaliacao-data">Avaliado em {formatData(av.createdAt)}</span>
                  </div>
                  <div className="media-badge">
                    <span className="media-numero">{mediaGeral(av)}</span>
                    <span className="media-label">média</span>
                  </div>
                </div>

                <div className="notas-lista">
                  <div className="nota-item">
                    <span className="nota-nome">Organização</span>
                    <EstrelasDisplay valor={av.organizacaoNota} />
                  </div>
                  <div className="nota-item">
                    <span className="nota-nome">Comunicação</span>
                    <EstrelasDisplay valor={av.comunicacaoNota} />
                  </div>
                  <div className="nota-item">
                    <span className="nota-nome">Clareza</span>
                    <EstrelasDisplay valor={av.clarezaNota} />
                  </div>
                  <div className="nota-item">
                    <span className="nota-nome">Experiência</span>
                    <EstrelasDisplay valor={av.experienciaNota} />
                  </div>
                </div>

                {(av.melhorParteTexto || av.pontosMelhoriaTexto || av.comentariosAdicionais) && (
                  <div className="comentarios-section">
                    {av.melhorParteTexto && (
                      <div className="comentario-item">
                        <span className="comentario-label">O que teve de melhor:</span>
                        <p>{av.melhorParteTexto}</p>
                      </div>
                    )}
                    {av.pontosMelhoriaTexto && (
                      <div className="comentario-item">
                        <span className="comentario-label">O que poderia melhorar:</span>
                        <p>{av.pontosMelhoriaTexto}</p>
                      </div>
                    )}
                    {av.comentariosAdicionais && (
                      <div className="comentario-item">
                        <span className="comentario-label">Comentários adicionais:</span>
                        <p>{av.comentariosAdicionais}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
