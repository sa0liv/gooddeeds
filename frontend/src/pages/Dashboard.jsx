import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fbfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #dae0e7', borderRadius: 12, padding: 40, textAlign: 'center', maxWidth: 400 }}>
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 16 }}>
          <path d="M16 28s-12-7.2-12-15.2C4 8 7.6 4.8 12 4.8c2 0 3.8.8 4 1.2.2-.4 2-1.2 4-1.2 4.4 0 8 3.2 8 8C28 20.8 16 28 16 28z" stroke="#2e9e6a" strokeWidth="2" fill="none"/>
        </svg>
        <h2 style={{ color: '#1d2630', marginBottom: 8 }}>Bem-vindo, {usuario.nome || 'Voluntário'}!</h2>
        <p style={{ color: '#67737e', marginBottom: 24 }}>Dashboard em construção — Sprint 2</p>
        <button onClick={sair} style={{ background: '#2e9e6a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Sair
        </button>
      </div>
    </div>
  );
}
