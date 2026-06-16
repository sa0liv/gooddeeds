import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RatingInput from '../components/RatingInput';
import {
  criarAvaliacaoVoluntario,
  inscricoesDoEvento,
  obterEvento,
  verificarAvaliacaoVoluntario,
} from '../services/api';
import './AvaliarEvento.css';

const notasIniciais = {
  pontualidade_nota: 0,
  colaboracao_nota: 0,
  comprometimento_nota: 0,
  desempenho_nota: 0,
};

export default function AvaliarVoluntario() {
  const { eventoId, voluntarioId } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [voluntario, setVoluntario] = useState(null);
  const [notas, setNotas] = useState(notasIniciais);
  const [pontosFortes, setPontosFortes] = useState('');
  const [pontosMelhoria, setPontosMelhoria] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventoId, voluntarioId]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [eventoRes, inscricoesRes, avalRes] = await Promise.all([
        obterEvento(eventoId),
        inscricoesDoEvento(eventoId),
        verificarAvaliacaoVoluntario(eventoId, voluntarioId),
      ]);

      const inscricao = inscricoesRes.data.find(i => String(i.usuario_id) === String(voluntarioId));
      setEvento(eventoRes.data);
      setVoluntario(inscricao || null);

      if (!inscricao) {
        setErro('Voluntario nao encontrado neste evento.');
      } else if (inscricao.presenca !== true) {
        setErro('A presenca precisa estar confirmada para avaliar este voluntario.');
      } else if (avalRes.data.jaAvaliou) {
        setErro('Voce ja avaliou este voluntario neste evento.');
      } else {
        setErro('');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao carregar dados da avaliacao.');
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

    const { pontualidade_nota, colaboracao_nota, comprometimento_nota, desempenho_nota } = notas;
    if (!pontualidade_nota || !colaboracao_nota || !comprometimento_nota || !desempenho_nota) {
      setErro('Por favor, preencha todas as notas antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      await criarAvaliacaoVoluntario({
        evento_id: parseInt(eventoId),
        voluntario_id: parseInt(voluntarioId),
        ...notas,
        pontos_fortes_texto: pontosFortes,
        pontos_melhoria_texto: pontosMelhoria,
        comentarios_adicionais: comentarios,
      });
      setSucesso(true);
    } catch (err) {
      if (!err.response) {
        setErro('Nao foi possivel conectar ao servidor. Verifique se o backend esta rodando.');
      } else {
        setErro(err.response.data?.erro || `Erro ${err.response.status}: Erro ao enviar avaliacao.`);
      }
    } finally {
      setEnviando(false);
    }
  };

  const bloqueado = !evento || (!!erro && (
    erro.includes('ja avaliou') ||
    erro.includes('presenca') ||
    erro.includes('nao encontrado')
  ));

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main avaliar-main">
        <button className="btn-voltar" onClick={() => navigate(`/evento/${eventoId}/presenca`)}>
          Voltar ao controle de presenca
        </button>

        {carregando ? (
          <div className="loading-state"><p>Carregando...</p></div>
        ) : sucesso ? (
          <div className="sucesso-state">
            <div className="sucesso-icon">OK</div>
            <h2>Avaliacao enviada!</h2>
            <p>A media do voluntario foi atualizada.</p>
            <div className="sucesso-actions">
              <button className="btn-acao btn-verde" onClick={() => navigate(`/evento/${eventoId}/presenca`)}>
                Controle de Presenca
              </button>
              <button className="btn-acao btn-outline" onClick={() => navigate(`/evento/${eventoId}/inscricoes`)}>
                Ver Inscricoes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="avaliar-header">
              <h1>Avaliar Voluntario</h1>
              <div className="evento-info-box">
                <strong>{voluntario?.nome || 'Voluntario'}</strong>
                <span>{evento?.titulo || 'Evento'}</span>
              </div>
              <p className="avaliar-descricao">
                Essa avaliacao compoe a media publica do voluntario para futuras inscricoes.
              </p>
            </div>

            {erro && <div className="alert alert-erro">{erro}</div>}

            <form onSubmit={handleEnviar} className="avaliar-form">
              <section className="form-section">
                <h2>Avaliacao Quantitativa</h2>
                <p className="section-desc">De uma nota de 1 a 5 para cada aspecto:</p>

                <div className="notas-grid">
                  <RatingInput
                    label="Pontualidade"
                    value={notas.pontualidade_nota}
                    onChange={v => setNota('pontualidade_nota', v)}
                    disabled={bloqueado}
                  />
                  <RatingInput
                    label="Colaboracao"
                    value={notas.colaboracao_nota}
                    onChange={v => setNota('colaboracao_nota', v)}
                    disabled={bloqueado}
                  />
                  <RatingInput
                    label="Comprometimento"
                    value={notas.comprometimento_nota}
                    onChange={v => setNota('comprometimento_nota', v)}
                    disabled={bloqueado}
                  />
                  <RatingInput
                    label="Desempenho geral"
                    value={notas.desempenho_nota}
                    onChange={v => setNota('desempenho_nota', v)}
                    disabled={bloqueado}
                  />
                </div>
              </section>

              <section className="form-section">
                <h2>Avaliacao Qualitativa</h2>

                <div className="campo-grupo">
                  <label htmlFor="pontosFortes">Pontos fortes</label>
                  <textarea
                    id="pontosFortes"
                    value={pontosFortes}
                    onChange={e => setPontosFortes(e.target.value)}
                    rows={3}
                    placeholder="O que o voluntario fez bem?"
                    disabled={bloqueado}
                  />
                </div>

                <div className="campo-grupo">
                  <label htmlFor="pontosMelhoria">Pontos de melhoria</label>
                  <textarea
                    id="pontosMelhoria"
                    value={pontosMelhoria}
                    onChange={e => setPontosMelhoria(e.target.value)}
                    rows={3}
                    placeholder="O que pode melhorar?"
                    disabled={bloqueado}
                  />
                </div>

                <div className="campo-grupo">
                  <label htmlFor="comentarios">Comentarios adicionais</label>
                  <textarea
                    id="comentarios"
                    value={comentarios}
                    onChange={e => setComentarios(e.target.value)}
                    rows={3}
                    placeholder="Algum comentario extra?"
                    disabled={bloqueado}
                  />
                </div>
              </section>

              {!bloqueado && (
                <button type="submit" className="btn-enviar" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar Avaliacao'}
                </button>
              )}
            </form>
          </>
        )}
      </main>
    </div>
  );
}
