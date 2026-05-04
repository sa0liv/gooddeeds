import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Auth.css';

const camposIniciais = { email: '', senha: '' };

function validar({ email, senha }) {
  const erros = {};
  if (!email) erros.email = 'E-mail é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'E-mail inválido';
  if (!senha) erros.senha = 'Senha é obrigatória';
  return erros;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(camposIniciais);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errosValidacao = validar(form);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setCarregando(true);
    setErroGeral('');
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao entrar. Tente novamente.';
      setErroGeral(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28s-12-7.2-12-15.2C4 8 7.6 4.8 12 4.8c2 0 3.8.8 4 1.2.2-.4 2-1.2 4-1.2 4.4 0 8 3.2 8 8C28 20.8 16 28 16 28z" stroke="#2e9e6a" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <h3 className="auth-title">Entrar no GoodDeeds</h3>
          <p className="auth-subtitle">Bem-vindo de volta!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {erroGeral && <div className="auth-erro-geral">{erroGeral}</div>}

          <div className="auth-campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              className={erros.email ? 'input-erro' : ''}
            />
            {erros.email && <span className="auth-erro">{erros.email}</span>}
          </div>

          <div className="auth-campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Sua senha"
              value={form.senha}
              onChange={handleChange}
              className={erros.senha ? 'input-erro' : ''}
            />
            {erros.senha && <span className="auth-erro">{erros.senha}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link-texto">
          Não tem conta? <Link to="/cadastro">Cadastrar-se</Link>
        </p>
      </div>
    </div>
  );
}
