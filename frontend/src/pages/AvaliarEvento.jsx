import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RatingInput from '../components/RatingInput';
import { obterEvento, criarAvaliacao, verificarAvaliacao } from '../services/api';
import './AvaliarEvento.css';

const notasIniciais = {
  organizacao_nota: 0,
  comunicacao_nota: 0,
  clareza_nota: 0,
  experiencia_nota: 0,
};

export default function AvaliarEvento() {
  const { eventoId } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [notas, setNotas] = useState(notasIniciais);
  const [melhorParte, setMelhorParte] = useState('');
  const [pontosMelhoria, setPontosMelhoria] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [eventoId]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [eventoRes, avalRes] = await Promise.all([
        obterEvento(eventoId),
        verificarAvaliacao(eventoId),
      ]);
      setEvento(eventoRes.data);
      if (avalRes.data.jaAvaliou) {
        setErro('Você já avaliou este evento.');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Evento não encontrado.');
    } finally {
      setCarregando(false);
    }
  };

  const setNota = (campo, valor) => {
    setNotas(prev => ({ ...prev, [campo]: valor }));
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    setErro('');

    const { organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota } = notas;
    if (!organizacao_nota || !comunicacao_nota || !clareza_nota || !experiencia_nota) {
      setErro('Por favor, preencha todas as notas antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      await criarAvaliacao({
        evento_id: parseInt(eventoId),
        ...notas,
        melhor_parte_texto: melhorParte,
        pontos_melhoria_texto: pontosMelhoria,
        comentarios_adicionais: comentarios,
      });
      setSucesso(true);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao enviar avaliação.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main avaliar-main">
        <button className="btn-voltar" onClick={() => navigate('/historico')}>
          ← Voltar ao Histórico
        </button>

        {carregando ? (
          <div className="loading-state"><p>Carregando...</p></div>
        ) : sucesso ? (
          <div className="sucesso-state">
            <div className="sucesso-icon">✓</div>
            <h2>Avaliação enviada!</h2>
            <p>Obrigado por avaliar o evento. Seu feedback é muito importante.</p>
            <div className="sucesso-actions">
              <button className="btn-acao btn-verde" onClick={() => navigate('/historico')}>
                Ver Histórico
              </button>
              <button className="btn-acao btn-outline" onClick={() => navigate('/minhas-avaliacoes')}>
                Minhas Avaliações
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="avaliar-header">
              <h1>Avaliar Evento</h1>
              {evento && (
                <div className="evento-info-box">
                  <strong>{evento.titulo}</strong>
                  <span>{evento.cidade} • {evento.categoria}</span>
                </div>
              )}
              <p className="avaliar-descricao">
                Sua avaliação ajuda a melhorar as próximas edições e orienta outros voluntários.
                Seja honesto e construtivo!
              </p>
            </div>

            {erro && <div className="alert alert-erro">{erro}</div>}

            <form onSubmit={handleEnviar} className="avaliar-form">
              <section className="form-section">
                <h2>Avaliação Quantitativa</h2>
                <p className="section-desc">Dê uma nota de 1 a 5 para cada aspecto:</p>

                <div className="notas-grid">
                  <RatingInput
                    label="Organização do evento"
                    value={notas.organizacao_nota}
                    onChange={v => setNota('organizacao_nota', v)}
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                  <RatingInput
                    label="Comunicação dos organizadores"
                    value={notas.comunicacao_nota}
                    onChange={v => setNota('comunicacao_nota', v)}
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                  <RatingInput
                    label="Clareza das informações"
                    value={notas.clareza_nota}
                    onChange={v => setNota('clareza_nota', v)}
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                  <RatingInput
                    label="Experiência geral"
                    value={notas.experiencia_nota}
                    onChange={v => setNota('experiencia_nota', v)}
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                </div>
              </section>

              <section className="form-section">
                <h2>Avaliação Qualitativa</h2>

                <div className="campo-grupo">
                  <label htmlFor="melhorParte">O que teve de melhor no evento?</label>
                  <textarea
                    id="melhorParte"
                    value={melhorParte}
                    onChange={e => setMelhorParte(e.target.value)}
                    rows={3}
                    placeholder="Conte o que mais gostou..."
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                </div>

                <div className="campo-grupo">
                  <label htmlFor="pontosMelhoria">O que poderia melhorar?</label>
                  <textarea
                    id="pontosMelhoria"
                    value={pontosMelhoria}
                    onChange={e => setPontosMelhoria(e.target.value)}
                    rows={3}
                    placeholder="Sugestões de melhoria..."
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                </div>

                <div className="campo-grupo">
                  <label htmlFor="comentarios">Comentários adicionais</label>
                  <textarea
                    id="comentarios"
                    value={comentarios}
                    onChange={e => setComentarios(e.target.value)}
                    rows={3}
                    placeholder="Algum comentário extra?"
                    disabled={!evento || (!!erro && erro.includes('já avaliou'))}
                  />
                </div>
              </section>

              {evento && !(erro && erro.includes('já avaliou')) && (
                <button
                  type="submit"
                  className="btn-enviar"
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              )}
            </form>
          </>
        )}
      </main>
    </div>
  );
}
