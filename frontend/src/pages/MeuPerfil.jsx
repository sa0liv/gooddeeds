import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { atualizarPerfil } from '../services/api';
import CidadeSelect from '../components/CidadeSelect';
import './MeuPerfil.css';

const SKILLS = ['Comunicação', 'Liderança', 'Trabalho em equipe', 'Organização', 'Ensino', 'Primeiros socorros', 'Tecnologia', 'Design', 'Fotografia', 'Culinária', 'Jardinagem', 'Construção', 'Música', 'Idiomas'];
const INTERESSES = ['Educação', 'Meio Ambiente', 'Saúde', 'Assistência Social', 'Cultura', 'Esporte', 'Direitos Humanos', 'Animais'];

export default function MeuPerfil() {
  const usuarioSalvo = JSON.parse(localStorage.getItem('usuario') || '{}');
  const perfilSalvo = JSON.parse(localStorage.getItem('perfil') || '{}');

  const [form, setForm] = useState({
    nome: usuarioSalvo.nome || '',
    telefone: usuarioSalvo.telefone || '',
    bio: perfilSalvo.bio || '',
    cidade: usuarioSalvo.cidade || perfilSalvo.cidade || '',
    disponibilidade: perfilSalvo.disponibilidade || '',
  });
  const [habilidades, setHabilidades] = useState(usuarioSalvo.habilidades || perfilSalvo.habilidades || []);
  const [interesses, setInteresses] = useState(usuarioSalvo.areas_interesse || perfilSalvo.interesses || []);
  const [novaHabilidade, setNovaHabilidade] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erroGeral, setErroGeral] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setHabilidades(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleInteresse = (interesse) => {
    setInteresses(prev =>
      prev.includes(interesse) ? prev.filter(i => i !== interesse) : [...prev, interesse]
    );
  };

  const adicionarHabilidade = () => {
    const nova = novaHabilidade.trim();
    if (nova && !habilidades.includes(nova)) {
      setHabilidades(prev => [...prev, nova]);
      setNovaHabilidade('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErroGeral('');
    setSucesso('');
    try {
      await atualizarPerfil({
        nome: form.nome,
        telefone: form.telefone,
        habilidades,
        areas_interesse: interesses,
        cidade: form.cidade,
      });

      const perfilLocal = { bio: form.bio, disponibilidade: form.disponibilidade, cidade: form.cidade, habilidades, interesses };
      localStorage.setItem('perfil', JSON.stringify(perfilLocal));

      const usuarioAtualizado = {
        ...usuarioSalvo,
        nome: form.nome,
        telefone: form.telefone,
        habilidades,
        areas_interesse: interesses,
        cidade: form.cidade,
      };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

      setSucesso('Perfil salvo com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar perfil';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main perfil-main">
        <h1>Meu Perfil</h1>

        {erroGeral && <div className="alert alert-erro">{erroGeral}</div>}
        {sucesso && <div className="alert alert-sucesso">{sucesso}</div>}

        <form onSubmit={handleSubmit} className="perfil-form">
          <div className="perfil-card">
            <h2 className="perfil-section-title">Informações básicas</h2>

            <div className="perfil-campo">
              <label>Nome</label>
              <input name="nome" type="text" value={form.nome} onChange={handleChange} placeholder="Seu nome completo" />
            </div>

            <div className="perfil-campo">
              <label>E-mail</label>
              <input type="email" value={usuarioSalvo.email || ''} disabled className="input-disabled" />
            </div>

            <div className="perfil-campo">
              <label>Telefone</label>
              <input name="telefone" type="text" value={form.telefone} onChange={handleChange} placeholder="Não informado" />
            </div>

            <div className="perfil-campo">
              <label>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Fale um pouco sobre você..."
                rows="3"
              />
            </div>

            <div className="perfil-campo">
              <label>Cidade</label>
              <CidadeSelect
                id="cidade-perfil"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />
            </div>

            <div className="perfil-campo">
              <label>Disponibilidade</label>
              <input name="disponibilidade" type="text" value={form.disponibilidade} onChange={handleChange} placeholder="Ex: Fins de semana, Noites..." />
            </div>
          </div>

          <div className="perfil-card">
            <h2 className="perfil-section-title">Habilidades</h2>
            <div className="chips-grid">
              {SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  className={`chip ${habilidades.includes(skill) ? 'chip-ativo' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="custom-chip-input">
              <input
                type="text"
                placeholder="Adicionar habilidade..."
                value={novaHabilidade}
                onChange={e => setNovaHabilidade(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarHabilidade())}
              />
              <button type="button" className="btn-add-chip" onClick={adicionarHabilidade}>+</button>
            </div>
            {habilidades.filter(s => !SKILLS.includes(s)).length > 0 && (
              <div className="chips-extras">
                {habilidades.filter(s => !SKILLS.includes(s)).map(skill => (
                  <span key={skill} className="chip chip-ativo">
                    {skill}
                    <button type="button" className="chip-remove" onClick={() => toggleSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="perfil-card">
            <h2 className="perfil-section-title">Interesses</h2>
            <div className="chips-grid">
              {INTERESSES.map(interesse => (
                <button
                  key={interesse}
                  type="button"
                  className={`chip ${interesses.includes(interesse) ? 'chip-ativo' : ''}`}
                  onClick={() => toggleInteresse(interesse)}
                >
                  {interesse}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-salvar-perfil" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Perfil'}
          </button>
        </form>
      </main>
    </div>
  );
}
