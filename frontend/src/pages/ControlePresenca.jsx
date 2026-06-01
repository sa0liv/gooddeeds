import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { inscricoesDoEvento, obterEvento, registrarPresenca } from '../services/api';
import './ControlePresenca.css';

export default function ControlePresenca() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [presencas, setPresencas] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

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
      const aprovados = inscricoesRes.data.filter(i => i.status === 'CONFIRMADA');
      setInscricoes(aprovados);

      const iniciais = {};
      aprovados.forEach(i => { iniciais[i.id] = i.presenca === true; });
      setPresencas(iniciais);
      setErroGeral('');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar dados';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const togglePresenca = (inscricaoId) => {
    setPresencas(prev => ({ ...prev, [inscricaoId]: !prev[inscricaoId] }));
  };

  const marcarTodos = () => {
    const todos = {};
    inscricoes.forEach(i => { todos[i.id] = true; });
    setPresencas(todos);
  };

  const salvarPresencas = async () => {
    setSalvando(true);
    setErroGeral('');
    try {
      await Promise.all(
        inscricoes.map(i => registrarPresenca(i.id, presencas[i.id] === true))
      );
      setToastMsg('Presenças salvas com sucesso!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      setErroGeral(err.response?.data?.erro || 'Erro ao salvar presenças');
    } finally {
      setSalvando(false);
    }
  };

  const totais = {
    aprovados: inscricoes.length,
    presentes: Object.values(presencas).filter(Boolean).length,
    ausentes: Object.values(presencas).filter(p => !p).length,
  };

  if (carregando) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main"><p className="loading-state">Carregando...</p></main>
      </div>
    );
  }

  const formatData = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).split('T')[0];
    const [year, month, day] = clean.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main controle-presenca-main">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="presenca-header">
          <div>
            <h1>Controle de Presença</h1>
            {evento && (
              <p className="presenca-subtitle">
                {evento.titulo}<br />
                <span className="presenca-meta">
                  {formatData(evento.data)} às {evento.horario} • {evento.local}, {evento.cidade}
                </span>
              </p>
            )}
          </div>
        </div>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}
        {toastMsg && <div className="alert alert-sucesso">{toastMsg}</div>}

        <div className="contadores-presenca">
          <div className="contador-presenca">
            <div className="contador-numero">{totais.aprovados}</div>
            <div className="contador-label">Aprovados</div>
          </div>
          <div className="contador-presenca">
            <div className="contador-numero presente">{totais.presentes}</div>
            <div className="contador-label">Presentes</div>
          </div>
          <div className="contador-presenca">
            <div className="contador-numero ausente">{totais.ausentes}</div>
            <div className="contador-label">Ausentes</div>
          </div>
        </div>

        {inscricoes.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum voluntário aprovado para este evento</p>
          </div>
        ) : (
          <>
            <div className="presenca-acoes">
              {totais.ausentes > 0 && (
                <button className="btn-marcar-todos" onClick={marcarTodos}>
                  ✓ Marcar todos como presentes
                </button>
              )}
              <button
                className="btn-salvar-presencas"
                onClick={salvarPresencas}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : '💾 Salvar presenças'}
              </button>
            </div>

            <div className="presenca-list">
              {inscricoes.map(inscricao => {
                const presente = presencas[inscricao.id];
                return (
                  <div key={inscricao.id} className="presenca-item">
                    <div className="presenca-item-main">
                      <div className="voluntario-avatar">
                        {inscricao.nome?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="presenca-item-info">
                        <h3>{inscricao.nome}</h3>
                        <p className="voluntario-email">{inscricao.email}</p>
                        {inscricao.telefone && (
                          <p className="voluntario-telefone">{inscricao.telefone}</p>
                        )}
                      </div>
                    </div>

                    <div className="presenca-item-right">
                      {presente ? (
                        <>
                          <span className="badge-presente">✓ Presente</span>
                          <button
                            className="btn-concluir-individual"
                            onClick={() => togglePresenca(inscricao.id)}
                          >
                            Desfazer
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="badge-ausente">○ Ausente</span>
                          <button
                            className="btn-marcar-presente"
                            onClick={() => togglePresenca(inscricao.id)}
                          >
                            Marcar presente
                          </button>
                        </>
                      )}
                    </div>
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
