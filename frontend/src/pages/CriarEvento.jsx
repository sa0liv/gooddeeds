import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { criarEvento } from '../services/api';
import CidadeSelect from '../components/CidadeSelect';
import './CriarEvento.css';

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
const SKILLS_PREDEFINIDAS = ['Comunicação', 'Liderança', 'Trabalho em equipe', 'Organização', 'Ensino', 'Primeiros socorros', 'Tecnologia', 'Design', 'Fotografia', 'Culinária', 'Jardinagem', 'Construção', 'Música', 'Idiomas'];

export default function CriarEvento() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    cidade: '',
    local: '',
    data: '',
    horario: '',
    vagas: '',
    carga_horaria: '',
    requisitos: '',
  });
  const [habilidades, setHabilidades] = useState([]);
  const [novaHabilidade, setNovaHabilidade] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
  };

  const toggleHabilidade = (skill) => {
    setHabilidades(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !habilidades.includes(novaHabilidade.trim())) {
      setHabilidades(prev => [...prev, novaHabilidade.trim()]);
      setNovaHabilidade('');
    }
  };

  const validar = () => {
    const novoErros = {};
    if (!form.titulo.trim()) novoErros.titulo = 'Título é obrigatório';
    if (!form.descricao.trim()) novoErros.descricao = 'Descrição é obrigatória';
    if (!form.categoria) novoErros.categoria = 'Categoria é obrigatória';
    if (!form.cidade) novoErros.cidade = 'Cidade é obrigatória';
    if (!form.local.trim()) novoErros.local = 'Local é obrigatório';
    if (!form.data) novoErros.data = 'Data é obrigatória';
    if (!form.horario) novoErros.horario = 'Horário é obrigatório';
    if (!form.vagas || form.vagas <= 0) novoErros.vagas = 'Vagas deve ser maior que 0';
    return novoErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errosValidacao = validar();
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setCarregando(true);
    setErroGeral('');
    setSucesso('');
    try {
      const payload = {
        ...form,
        vagas: parseInt(form.vagas),
        carga_horaria: form.carga_horaria ? parseFloat(form.carga_horaria) : null,
        habilidades,
      };
      await criarEvento(payload);
      setSucesso('Evento criado com sucesso!');
      setTimeout(() => navigate('/meus-eventos'), 2000);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao criar evento. Tente novamente.';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main criar-evento-main">
        <button className="voltar-btn" onClick={() => navigate(-1)}>← Voltar</button>

        <div className="criar-evento-header">
          <h1>Criar Novo Evento</h1>
        </div>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}
        {sucesso && <div className="alert alert-sucesso">{sucesso}</div>}

        <form onSubmit={handleSubmit} className="criar-evento-form">
          {/* ── Informações do Evento ── */}
          <div className="form-card">
            <h2 className="form-card-title">Informações do Evento</h2>

            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Nome do evento"
                value={form.titulo}
                onChange={handleChange}
                className={erros.titulo ? 'input-erro' : ''}
              />
              {erros.titulo && <span className="erro-msg">{erros.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o evento..."
                value={form.descricao}
                onChange={handleChange}
                rows="4"
                className={erros.descricao ? 'input-erro' : ''}
              />
              {erros.descricao && <span className="erro-msg">{erros.descricao}</span>}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className={erros.categoria ? 'input-erro' : ''}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {erros.categoria && <span className="erro-msg">{erros.categoria}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade *</label>
                <CidadeSelect
                  id="cidade"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  className={erros.cidade ? 'input-erro' : ''}
                />
                {erros.cidade && <span className="erro-msg">{erros.cidade}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="local">Local *</label>
              <input
                id="local"
                name="local"
                type="text"
                placeholder="Endereço ou local do evento"
                value={form.local}
                onChange={handleChange}
                className={erros.local ? 'input-erro' : ''}
              />
              {erros.local && <span className="erro-msg">{erros.local}</span>}
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="data">Data *</label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  value={form.data}
                  onChange={handleChange}
                  className={erros.data ? 'input-erro' : ''}
                />
                {erros.data && <span className="erro-msg">{erros.data}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="horario">Horário *</label>
                <input
                  id="horario"
                  name="horario"
                  type="time"
                  value={form.horario}
                  onChange={handleChange}
                  className={erros.horario ? 'input-erro' : ''}
                />
                {erros.horario && <span className="erro-msg">{erros.horario}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="vagas">Vagas *</label>
                <input
                  id="vagas"
                  name="vagas"
                  type="number"
                  placeholder="0"
                  value={form.vagas}
                  onChange={handleChange}
                  min="1"
                  className={erros.vagas ? 'input-erro' : ''}
                />
                {erros.vagas && <span className="erro-msg">{erros.vagas}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="carga_horaria">Carga horária (h)</label>
              <input
                id="carga_horaria"
                name="carga_horaria"
                type="number"
                placeholder="0"
                value={form.carga_horaria}
                onChange={handleChange}
                step="0.5"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requisitos">Requisitos</label>
              <input
                id="requisitos"
                name="requisitos"
                type="text"
                placeholder="Ex: Maiores de 18 anos, Disposição física"
                value={form.requisitos}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Habilidades Desejadas ── */}
          <div className="form-card">
            <h2 className="form-card-title">Habilidades Desejadas</h2>

            <div className="skills-grid">
              {SKILLS_PREDEFINIDAS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-tag ${habilidades.includes(skill) ? 'active' : ''}`}
                  onClick={() => toggleHabilidade(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="custom-skill-input">
              <input
                type="text"
                placeholder="Adicionar habilidade..."
                value={novaHabilidade}
                onChange={(e) => setNovaHabilidade(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarHabilidade())}
              />
              <button type="button" onClick={adicionarHabilidade} className="btn-add-skill">+</button>
            </div>

            {habilidades.length > 0 && (
              <div className="selected-skills">
                {habilidades.map(skill => (
                  <span key={skill} className="selected-skill">
                    {skill}
                    <button
                      type="button"
                      className="remove-skill"
                      onClick={() => toggleHabilidade(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-criar-evento" disabled={carregando}>
            {carregando ? 'Criando evento...' : 'Criar evento'}
          </button>
        </form>
      </main>
    </div>
  );
}
