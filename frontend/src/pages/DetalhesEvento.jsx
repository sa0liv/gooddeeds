import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { obterEvento, inscreverEvento, minhasInscricoes, resumoAvaliacoes } from '../services/api';
import { calcularCompatibilidade } from '../utils/compatibilidade';
import './DetalhesEvento.css';

function CalendarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function CityIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>;
}
function TagIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}
function PeopleIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function TimerIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
}

const STOPWORDS = new Set([
  'de', 'a', 'o', 'e', 'que', 'para', 'com', 'foi', 'muito', 'um', 'uma',
  'os', 'as', 'em', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  'se', 'por', 'mas', 'ao', 'isso', 'mais', 'eu', 'ele', 'ela',
  'ser', 'ter', 'já', 'não', 'sim', 'bem', 'só', 'até', 'quando', 'como', 'também',
]);

const CLOUD_COLORS = [
  '#2e9e6a', '#3b82f6', '#f59e0b', '#e84855', '#8b5cf6',
  '#06b6d4', '#ec4899', '#10b981', '#f97316', '#6366f1',
  '#14b8a6', '#d97706', '#a855f7', '#0ea5e9', '#ef4444',
];

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

function WordCloud({ palavras }) {
  if (palavras.length === 0) {
    return (
      <p className="de-wordcloud-vazia">
        Ainda não há comentários para gerar a nuvem de palavras.
      </p>
    );
  }

  const maxFreq = palavras[0]?.contagem || 1;
  const minSize = 0.85;
  const maxSize = 2.2;

  return (
    <div className="de-wordcloud">
      {palavras.map(({ palavra, contagem }, idx) => {
        const tamanho = minSize + ((contagem / maxFreq) * (maxSize - minSize));
        const opacity = 0.6 + (contagem / maxFreq) * 0.4;
        const cor = CLOUD_COLORS[idx % CLOUD_COLORS.length];
        return (
          <span
            key={palavra}
            className="de-wordcloud-word"
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

export default function DetalhesEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [jaInscrito, setJaInscrito] = useState(false);
  const [inscrevendo, setInscrevendo] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [palavras, setPalavras] = useState([]);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    setCarregando(true);
    try {
      const [eventoRes, inscricoeRes] = await Promise.all([
        obterEvento(id),
        minhasInscricoes().catch(() => null),
      ]);

      const ev = eventoRes.data;
      setEvento(ev);

      if (inscricoeRes) {
        setInscricoes(inscricoeRes.data);
        const jaInscrito = inscricoeRes.data.some(i => i.evento_id === parseInt(id));
        setJaInscrito(jaInscrito);
      }

      if (ev.status === 'ENCERRADO') {
        try {
          const resumoRes = await resumoAvaliacoes(id);
          if (resumoRes.data?.comentarios?.length > 0) {
            setPalavras(calcularPalavrasFrequentes(resumoRes.data.comentarios));
          }
        } catch {
          // sem avaliações, ok
        }
      }

      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar evento';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleInscrever = async () => {
    setInscrevendo(true);
    try {
      await inscreverEvento(id);
      setJaInscrito(true);
      setShowConfirm(false);
      const res = await minhasInscricoes();
      setInscricoes(res.data);
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao se inscrever';
      setErroGeral(msg);
    } finally {
      setInscrevendo(false);
    }
  };

  const formatData = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).split('T')[0];
    const [year, month, day] = clean.split('-');
    return `${day}/${month}/${year}`;
  };

  if (carregando) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando evento...</p>
        </main>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#f44336' }}>
            Evento não encontrado
          </p>
        </main>
      </div>
    );
  }

  const encerrado = evento.status === 'ENCERRADO';
  const compatibilidade = calcularCompatibilidade(usuario, evento);
  const isOrganizador = usuario.id === evento.criadorId;
  const temVagas = evento.vagas > 0;
  const podeInscrever = !isOrganizador && !jaInscrito && temVagas && !encerrado;

  const badgeClass = encerrado ? 'encerrado' : temVagas ? 'ativo' : 'completo';
  const badgeLabel = encerrado ? 'Encerrado' : temVagas ? 'Aberto' : 'Completo';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main detalhes-evento-main">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        <div className="evento-detalhes-container">
          <div className="evento-detalhes-header">
            <div className="evento-detalhes-title">
              <h1>{evento.titulo}</h1>
              <span className={`status-badge ${badgeClass}`}>
                {badgeLabel}
              </span>
            </div>
          </div>

          <div className="evento-detalhes-grid">
            {/* Coluna Principal */}
            <div className="evento-detalhes-main">
              <section className="detalhes-section">
                <h2>Descrição</h2>
                <p className="evento-descricao">{evento.descricao}</p>
              </section>

              <section className="detalhes-section">
                <h2>Informações do Evento</h2>
                <div className="info-grid-2">
                  <div className="info-item">
                    <span className="info-label"><CalendarIcon /> Data</span>
                    <span className="info-value">{formatData(evento.data)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><ClockIcon /> Horário</span>
                    <span className="info-value">{evento.horario}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><PinIcon /> Local</span>
                    <span className="info-value">{evento.local}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><CityIcon /> Cidade</span>
                    <span className="info-value">{evento.cidade}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><TagIcon /> Categoria</span>
                    <span className="info-value">{evento.categoria}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><PeopleIcon /> Vagas</span>
                    <span className="info-value">{evento.vagas}</span>
                  </div>
                  {evento.carga_horaria && (
                    <div className="info-item">
                      <span className="info-label"><TimerIcon /> Carga Horária</span>
                      <span className="info-value">{evento.carga_horaria} horas</span>
                    </div>
                  )}
                </div>
              </section>

              {evento.requisitos && (
                <section className="detalhes-section">
                  <h2>Requisitos</h2>
                  <p>{evento.requisitos}</p>
                </section>
              )}

              {evento.habilidades && evento.habilidades.length > 0 && (
                <section className="detalhes-section">
                  <h2>Habilidades Desejadas</h2>
                  <div className="skills-list">
                    {evento.habilidades.map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Nuvem de palavras — só para eventos encerrados */}
              {encerrado && (
                <section className="detalhes-section de-historico-section">
                  <h2>Nuvem de Palavras das Avaliações</h2>
                  <p className="de-historico-desc">
                    Palavras mais mencionadas pelos voluntários que participaram deste evento.
                  </p>
                  <WordCloud palavras={palavras} />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="evento-detalhes-sidebar">
              <div className="detalhes-card organizador-card">
                <h3>Organizador</h3>
                <div className="organizador-info">
                  <div className="organizador-avatar">
                    {evento.criador_nome?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="organizador-text">
                    <div className="organizador-nome">{evento.criador_nome || 'Organizador'}</div>
                    <div className="organizador-email">{evento.criador_email}</div>
                  </div>
                </div>
              </div>

              {!isOrganizador && !encerrado && (
                <div className="detalhes-card compatibilidade-card">
                  <h3>Compatibilidade</h3>
                  <div className="compatibilidade-display">
                    <div className="compatibilidade-numero">{compatibilidade}%</div>
                    <div className="compatibilidade-bar">
                      <div
                        className="compatibilidade-fill"
                        style={{ width: `${compatibilidade}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="compatibilidade-desc">
                    Baseado em habilidades, localização e interesses
                  </p>
                </div>
              )}

              {encerrado ? (
                <div className="detalhes-card">
                  <p className="info-texto" style={{ color: '#9ca3af', fontWeight: 600 }}>
                    Este evento foi encerrado
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#67737e', marginTop: '0.5rem' }}>
                    Confira a nuvem de palavras das avaliações ao lado.
                  </p>
                </div>
              ) : isOrganizador ? (
                <div className="detalhes-card">
                  <p className="info-texto" style={{ color: '#2e9e6a' }}>
                    Este é seu evento
                  </p>
                  <button
                    className="btn-detalhe btn-editar"
                    onClick={() => navigate(`/evento/${id}/editar`)}
                  >
                    Editar Evento
                  </button>
                  <button
                    className="btn-detalhe btn-inscricoes"
                    onClick={() => navigate(`/evento/${id}/inscricoes`)}
                  >
                    Ver Inscrições
                  </button>
                </div>
              ) : jaInscrito ? (
                <div className="detalhes-card inscricao-card">
                  <p className="info-texto inscrito">✓ Você já está inscrito</p>
                  <p className="info-texto" style={{ color: '#ff9800', marginTop: '0.5rem' }}>
                    Status: Pendente de aprovação
                  </p>
                </div>
              ) : !temVagas ? (
                <div className="detalhes-card">
                  <p className="info-texto" style={{ color: '#f44336' }}>
                    Este evento não tem vagas disponíveis
                  </p>
                </div>
              ) : (
                <div className="detalhes-card">
                  {showConfirm ? (
                    <>
                      <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Tem certeza que deseja se inscrever?
                      </p>
                      <button
                        className="btn-detalhe btn-inscrever"
                        onClick={handleInscrever}
                        disabled={inscrevendo}
                      >
                        {inscrevendo ? 'Inscrevendo...' : 'Confirmar Inscrição'}
                      </button>
                      <button
                        className="btn-detalhe btn-cancelar"
                        onClick={() => setShowConfirm(false)}
                        disabled={inscrevendo}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-detalhe btn-inscrever"
                      onClick={() => setShowConfirm(true)}
                    >
                      Inscrever-se
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
