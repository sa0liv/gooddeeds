import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { minhasInscricoes } from '../services/api';
import './Comprovantes.css';

function CertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

export default function Comprovantes() {
  const [aprovados, setAprovados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');
  const [comprovanteSelecionado, setComprovanteSelecionado] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    carregarComprovantes();
  }, []);

  const carregarComprovantes = async () => {
    setCarregando(true);
    setErroGeral('');
    try {
      const response = await minhasInscricoes();
      const confirmadas = response.data.filter(i => i.status === 'CONFIRMADA');
      setAprovados(confirmadas);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar comprovantes';
      setErroGeral(msg);
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
      <main className="app-main comprovantes-main">
        <h1>Meus Comprovantes</h1>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        {carregando ? (
          <div className="loading-state"><p>Carregando comprovantes...</p></div>
        ) : aprovados.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum comprovante disponível</p>
            <p style={{ fontSize: '0.9rem', color: '#67737e' }}>
              Seus comprovantes aparecerão aqui após suas inscrições serem aprovadas
            </p>
          </div>
        ) : (
          <div className="comprovantes-list">
            {aprovados.map(inscricao => (
              <div key={inscricao.id} className="comprovante-item">
                <div className="comprovante-info">
                  <h3 className="comprovante-titulo">{inscricao.titulo}</h3>
                  <p className="comprovante-meta">
                    {formatData(inscricao.data)}
                    {inscricao.carga_horaria ? ` • ${inscricao.carga_horaria}h` : ''}
                  </p>
                  {inscricao.criador_nome && (
                    <p className="comprovante-organizador">
                      Organizado por {inscricao.criador_nome}
                    </p>
                  )}
                </div>
                <button
                  className="btn-ver-comprovante"
                  onClick={() => setComprovanteSelecionado(inscricao)}
                >
                  <CertIcon /> Ver comprovante
                </button>
              </div>
            ))}
          </div>
        )}

        {comprovanteSelecionado && (
          <div className="modal-overlay" onClick={() => setComprovanteSelecionado(null)}>
            <div className="modal-comprovante" onClick={e => e.stopPropagation()}>
              <div className="comprovante-doc">
                <div className="comprovante-doc-header">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 28s-12-7.2-12-15.2C4 8 7.6 4.8 12 4.8c2 0 3.8.8 4 1.2.2-.4 2-1.2 4-1.2 4.4 0 8 3.2 8 8C28 20.8 16 28 16 28z" fill="#2e9e6a"/>
                  </svg>
                  <span className="comprovante-doc-marca">GoodDeeds</span>
                </div>
                <h2>Comprovante de Voluntariado</h2>
                <p className="comprovante-doc-nome">
                  Certificamos que <strong>{usuario.nome}</strong> participou como voluntário(a) no evento:
                </p>
                <div className="comprovante-doc-evento">
                  <strong>{comprovanteSelecionado.titulo}</strong>
                  <span>
                    {formatData(comprovanteSelecionado.data)}
                    {comprovanteSelecionado.carga_horaria ? ` — ${comprovanteSelecionado.carga_horaria} horas` : ''}
                  </span>
                  {comprovanteSelecionado.local && (
                    <span>{comprovanteSelecionado.local}</span>
                  )}
                  {comprovanteSelecionado.criador_nome && (
                    <span>Organizado por: {comprovanteSelecionado.criador_nome}</span>
                  )}
                </div>
                <div className="comprovante-doc-footer">
                  <p>Emitido em {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <button className="modal-fechar" onClick={() => setComprovanteSelecionado(null)}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
