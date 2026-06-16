import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { resumoAvaliacoes, obterEvento } from '../services/api';
import './AvaliacoesEvento.css';

const STOPWORDS = new Set([
  'de', 'a', 'o', 'e', 'que', 'para', 'com', 'foi', 'muito', 'um', 'uma',
  'os', 'as', 'em', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  'se', 'por', 'mas', 'ao', 'isso', 'mais', 'eu', 'ele', 'ela',
  'ser', 'ter', 'já', 'não', 'sim', 'bem', 'só', 'até', 'quando', 'como', 'também',
]);

function calcularPalavrasFrequentes(comentarios) {
  const textos = comentarios.flatMap(c => [
    c.melhor_parte_texto || '',
    c.pontos_melhoria_texto || '',
    c.comentarios_adicionais || '',
  ]).join(' ');

  const palavras = textos
    .toLowerCase()
    .replace(/[^a-záéíóúàâêôãõüç\s]/gi, ' ')
    .split(/\s+/)
    .filter(p => p.length > 2 && !STOPWORDS.has(p));

  const freq = {};
  for (const p of palavras) {
    freq[p] = (freq[p] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([palavra, contagem]) => ({ palavra, contagem }));
}

const CLOUD_COLORS = [
  '#2e9e6a', '#3b82f6', '#f59e0b', '#e84855', '#8b5cf6',
  '#06b6d4', '#ec4899', '#10b981', '#f97316', '#6366f1',
  '#14b8a6', '#d97706', '#a855f7', '#0ea5e9', '#ef4444',
];

function WordCloud({ palavras }) {
  if (palavras.length === 0) {
    return (
      <p className="wordcloud-vazia">
        Ainda não há comentários suficientes para gerar a nuvem de palavras.
      </p>
    );
  }

  const maxFreq = palavras[0]?.contagem || 1;
  const minSize = 0.8;
  const maxSize = 2.4;

  return (
    <div className="wordcloud">
      {palavras.map(({ palavra, contagem }, idx) => {
        const tamanho = minSize + ((contagem / maxFreq) * (maxSize - minSize));
        const opacity = 0.65 + (contagem / maxFreq) * 0.35;
        const cor = CLOUD_COLORS[idx % CLOUD_COLORS.length];
        return (
          <span
            key={palavra}
            className="wordcloud-word"
            style={{ fontSize: `${tamanho}rem`, opacity, color: cor }}
            title={`${contagem} ocorrência${contagem > 1 ? 's' : ''}`}
          >
            {palavra}
          </span>
        );
      })}
    </div>
  );
}

function MiniBar({ valor, max = 5 }) {
  const pct = (valor / max) * 100;
  return (
    <div className="mini-bar-wrap">
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="mini-bar-label">{valor}</span>
    </div>
  );
}

export default function AvaliacoesEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [palavras, setPalavras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
    try {
      const [eventoRes, resumoRes] = await Promise.all([
        obterEvento(id),
        resumoAvaliacoes(id),
      ]);
      setEvento(eventoRes.data);
      setResumo(resumoRes.data);
      setPalavras(calcularPalavrasFrequentes(resumoRes.data.comentarios || []));
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar avaliações';
      setErro(msg);
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
      <main className="app-main avaliacoes-evento-main">
        <button className="btn-voltar" onClick={() => navigate('/meus-eventos')}>
          ← Voltar aos Meus Eventos
        </button>

        {carregando ? (
          <div className="loading-state"><p>Carregando avaliações...</p></div>
        ) : erro ? (
          <div className="alert alert-erro">{erro}</div>
        ) : (
          <>
            <div className="ae-header">
              <h1>Avaliações do Evento</h1>
              {evento && (
                <p className="ae-evento-nome">{evento.titulo}</p>
              )}
            </div>

            {resumo.totalAvaliacoes === 0 ? (
              <div className="empty-state">
                <p>Nenhuma avaliação recebida ainda</p>
                <p className="empty-state-sub">
                  Quando os voluntários avaliarem o evento, as informações aparecerão aqui
                </p>
              </div>
            ) : (
              <>
                {/* Resumo de médias */}
                <div className="resumo-grid">
                  <div className="resumo-card resumo-destaque">
                    <span className="resumo-numero">{resumo.totalAvaliacoes}</span>
                    <span className="resumo-titulo">Avaliações</span>
                  </div>
                  <div className="resumo-card resumo-destaque">
                    <span className="resumo-numero">{resumo.mediaGeral}</span>
                    <span className="resumo-titulo">Média Geral</span>
                  </div>
                </div>

                <div className="medias-section">
                  <h2>Médias por Critério</h2>
                  <div className="medias-lista">
                    <div className="media-item">
                      <span className="media-criterio">Organização do evento</span>
                      <MiniBar valor={resumo.mediaOrganizacao} />
                    </div>
                    <div className="media-item">
                      <span className="media-criterio">Comunicação dos organizadores</span>
                      <MiniBar valor={resumo.mediaComunicacao} />
                    </div>
                    <div className="media-item">
                      <span className="media-criterio">Clareza das informações</span>
                      <MiniBar valor={resumo.mediaClareza} />
                    </div>
                    <div className="media-item">
                      <span className="media-criterio">Experiência geral</span>
                      <MiniBar valor={resumo.mediaExperiencia} />
                    </div>
                  </div>
                </div>

                {/* Nuvem de palavras */}
                <div className="wordcloud-section">
                  <h2>Nuvem de Palavras</h2>
                  <p className="section-desc">Baseada nos comentários qualitativos dos voluntários</p>
                  <WordCloud palavras={palavras} />
                </div>

                {/* Comentários */}
                {resumo.comentarios && resumo.comentarios.some(c =>
                  c.melhor_parte_texto || c.pontos_melhoria_texto || c.comentarios_adicionais
                ) && (
                  <div className="comentarios-section">
                    <h2>Comentários dos Voluntários</h2>
                    <div className="comentarios-lista">
                      {resumo.comentarios.map((c, i) => (
                        (c.melhor_parte_texto || c.pontos_melhoria_texto || c.comentarios_adicionais) ? (
                          <div key={i} className="comentario-card">
                            {c.melhor_parte_texto && (
                              <div className="comentario-bloco">
                                <span className="comentario-label positivo">O que teve de melhor</span>
                                <p>{c.melhor_parte_texto}</p>
                              </div>
                            )}
                            {c.pontos_melhoria_texto && (
                              <div className="comentario-bloco">
                                <span className="comentario-label melhoria">O que poderia melhorar</span>
                                <p>{c.pontos_melhoria_texto}</p>
                              </div>
                            )}
                            {c.comentarios_adicionais && (
                              <div className="comentario-bloco">
                                <span className="comentario-label">Comentários adicionais</span>
                                <p>{c.comentarios_adicionais}</p>
                              </div>
                            )}
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
