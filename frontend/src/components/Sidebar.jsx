import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function EventIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 1 0 10 10M12 12l8-8"/>
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6"/>
    </svg>
  );
}

function CertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <circle cx="12" cy="14" r="5"/><path d="M12 12v5M15 11l3-3"/>
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function HistoricoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3M3 4v4h4"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 3l3 3-3 3M19 6H9"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/meus-eventos', label: 'Meus Eventos', icon: <EventIcon /> },
  { path: '/criar-evento', label: 'Criar Evento', icon: <PlusIcon /> },
  { path: '/explorar-eventos', label: 'Explorar Eventos', icon: <ExploreIcon /> },
  { path: '/minhas-inscricoes', label: 'Minhas Inscrições', icon: <ClipboardIcon /> },
  { path: '/comprovantes', label: 'Comprovantes', icon: <CertIcon /> },
  { path: '/historico', label: 'Histórico', icon: <HistoricoIcon /> },
  { path: '/minhas-avaliacoes', label: 'Minhas Avaliações', icon: <StarIcon /> },
  { path: '/perfil', label: 'Meu Perfil', icon: <PersonIcon /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const getInitiais = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const close = () => setOpen(false);

  return (
    <>
      <div className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <HamburgerIcon />
        </button>
        <span className="mobile-topbar-logo">GoodDeeds</span>
      </div>

      {open && <div className="sidebar-backdrop" onClick={close} />}

      <div className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path d="M11 19S2 13.2 2 7.8C2 5 4.24 2.8 7 2.8c1.4 0 2.66.6 3 .9.34-.3 1.6-.9 3-.9 2.76 0 5 2.2 5 5 0 5.4-9 11.2-9 11.2z" fill="#2e9e6a"/>
          </svg>
          <span>GoodDeeds</span>
          <button className="sidebar-close-btn" onClick={close} aria-label="Fechar menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={close}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitiais(usuario.nome)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{usuario.nome || 'Usuário'}</div>
              <div className="sidebar-user-email">{usuario.email || ''}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={sair} title="Sair">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </>
  );
}
