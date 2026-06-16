import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import { listarEventos } from '../services/api';
import { calcularCompatibilidade } from '../utils/compatibilidade';
import './ExplorarEventos.css';

const CATEGORIAS = ['Meio Ambiente', 'Educação', 'Saúde', 'Cultura', 'Social', 'Tecnologia', 'Esporte', 'Outros'];
const CIDADES = [
  'Aracaju', 'Belém', 'Belo Horizonte', 'Boa Vista', 'Brasília',
  'Campo Grande', 'Campinas', 'Caruaru', 'Caxias do Sul', 'Cuiabá',
  'Curitiba', 'Feira de Santana', 'Florianópolis', 'Fortaleza', 'Goiânia',
  'Governador Valadares', 'Guarulhos', 'João Pessoa', 'Joinville', 'Juiz de Fora',
  'Londrina', 'Maceió', 'Manaus', 'Maringá', 'Natal',
  'Niterói', 'Osasco', 'Palmas', 'Porto Alegre', 'Porto Velho',
  'Presidente Prudente', 'Recife', 'Ribeirão Preto', 'Rio Branco', 'Rio de Janeiro', 'Salvador',
  'Santarém', 'Santo André', 'Santos', 'São Luís', 'São Paulo',
  'Sorocaba', 'Teresina', 'Uberlândia', 'Vitória',
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function HistoricoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default function ExplorarEventos() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: '',
    cidade: '',
    busca: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  useEffect(() => {
    carregarEventos();
  }, [filtros]);

  const carregarEventos = async () => {
    setCarregando(true);
    setErroGeral('');
    try {
      const params = {};
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.cidade) params.cidade = filtros.cidade;

      const response = await listarEventos(params);
      setEventos(response.data);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao carregar eventos';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleBusca = (e) => {
    const valor = e.target.value.toLowerCase();
    setFiltros(prev => ({ ...prev, busca: valor }));
  };

  const eventosFiltrados = eventos.filter(evento => {
    if (filtros.busca) {
      return evento.titulo.toLowerCase().includes(filtros.busca) ||
             evento.descricao.toLowerCase().includes(filtros.busca);
    }
    return true;
  });

  const eventosAtivos = eventosFiltrados.filter(e => e.status !== 'ENCERRADO');
  const eventosEncerrados = eventosFiltrados.filter(e => e.status === 'ENCERRADO');

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main explorar-eventos-main">
        <div className="explorar-header">
          <h1>Explorar Eventos</h1>
          <p className="explorar-subtitle">Encontre oportunidades para fazer diferença</p>
        </div>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}

        <div className="filtros-bar">
          <div className="filtro-busca-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={filtros.busca}
              onChange={handleBusca}
              className="filtro-busca"
            />
          </div>
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            name="cidade"
            value={filtros.cidade}
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todas as cidades</option>
            {CIDADES.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
        </div>

        {carregando ? (
          <div className="loading-state">
            <p>Carregando eventos...</p>
          </div>
        ) : (
          <>
            {/* Eventos ativos */}
            {eventosAtivos.length === 0 && eventosEncerrados.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum evento encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <>
                {eventosAtivos.length > 0 && (
                  <div className="eventos-grid">
                    {eventosAtivos.map(evento => {
                      const compatibilidade = calcularCompatibilidade(usuario, evento);
                      return (
                        <EventCard
                          key={evento.id}
                          evento={evento}
                          compatibilidade={compatibilidade}
                          showCompatibilidade={true}
                          actions={[
                            {
                              label: 'Ver Detalhes',
                              variant: 'primary',
                              onClick: () => navigate(`/evento/${evento.id}`),
                            },
                          ]}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Seção Histórico */}
                {eventosEncerrados.length > 0 && (
                  <div className="historico-section">
                    <div className="historico-header">
                      <HistoricoIcon />
                      <h2>Histórico de Eventos</h2>
                      <span className="historico-count">{eventosEncerrados.length} encerrado{eventosEncerrados.length !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="historico-desc">Eventos já realizados. Clique em "Ver Detalhes" para ver avaliações e nuvem de palavras.</p>
                    <div className="eventos-grid historico-grid">
                      {eventosEncerrados.map(evento => {
                        const compatibilidade = calcularCompatibilidade(usuario, evento);
                        return (
                          <EventCard
                            key={evento.id}
                            evento={evento}
                            compatibilidade={compatibilidade}
                            showCompatibilidade={false}
                            actions={[
                              {
                                label: 'Ver Detalhes',
                                variant: 'secondary',
                                onClick: () => navigate(`/evento/${evento.id}`),
                              },
                            ]}
                          />
                        );
                      })}
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
