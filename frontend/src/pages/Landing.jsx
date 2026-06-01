import { Link } from 'react-router-dom';
import './Landing.css';

function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function IconAward() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconCalSm() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

const features = [
  { Icon: IconUser, title: 'Crie seu perfil', desc: 'Cadastre-se como voluntário ou organizador' },
  { Icon: IconCalendar, title: 'Encontre eventos', desc: 'Descubra oportunidades que combinam com você' },
  { Icon: IconCheck, title: 'Participe e faça a diferença', desc: 'Inscreva-se e contribua para transformar comunidades' },
  { Icon: IconAward, title: 'Receba comprovantes', desc: 'Construa uma forma de reconhecimento das suas ações' },
];

const events = [
  {
    title: 'Mutirão de Limpeza da Praia',
    desc: 'Junte-se a nós para limpar a praia de Copacabana e conscientizar sobre a preservação do meio ambiente.',
    match: '0% match',
    date: '2026-05-10 às 08:00',
    local: 'Rio de Janeiro — Praia de Copacabana - Posto 6',
    vagas: '30 vagas',
    category: 'Meio Ambiente',
  },
  {
    title: 'Aulas de Reforço Escolar',
    desc: 'Programa de reforço escolar para crianças de 8 a 12 anos em comunidades carentes. Ajude a transformar vidas.',
    match: '100% match',
    date: '2026-05-15 às 14:00',
    local: 'São Paulo — Centro Comunitário Vila Esperança',
    vagas: '10 vagas',
    category: 'Educação',
  },
  {
    title: 'Campanha de Doação de Sangue',
    desc: 'Organização de uma campanha de conscientização e doação de sangue no centro da cidade.',
    match: '20% match',
    date: '2026-05-20 às 09:00',
    local: 'Belo Horizonte — Hemocentro Central',
    vagas: '15 vagas',
    category: 'Saúde',
  },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* Hero + Header */}
      <div className="lp-hero">
        <div className="lp-hero-overlay">
          <header className="lp-header">
            <div className="lp-inner">
              <span className="lp-logo">GoodDeeds</span>
              <nav className="lp-nav">
                <Link to="/login" className="lp-btn btn-ghost">Já tenho conta</Link>
                <Link to="/cadastro" className="lp-btn btn-ghost-fill">Cadastrar</Link>
              </nav>
            </div>
          </header>
          <div className="lp-hero-body">
            <div className="lp-inner">
              <h1>GoodDeeds</h1>
              <p>Conectando pessoas que querem fazer a diferença</p>
              <div className="lp-hero-btns">
                <Link to="/cadastro" className="lp-btn btn-hero-solid btn-lg">Começar agora</Link>
                <Link to="/login" className="lp-btn btn-ghost btn-lg">Já tenho conta</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Como Funciona */}
      <section className="lp-bg-white">
        <div className="lp-inner lp-pad">
          <h2 className="lp-title">Como funciona</h2>
          <p className="lp-subtitle">Simples, rápido e eficiente</p>
          <div className="lp-grid-4">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="lp-feature-card">
                <div className="lp-feature-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voluntários encontram propósito */}
      <section className="lp-bg-light">
        <div className="lp-inner lp-pad lp-two-col">
          <div className="lp-col-text">
            <h2>Voluntários encontram propósito</h2>
            <p>Descubra oportunidades compatíveis com suas habilidades e interesses. Acompanhe suas participações e construa seu histórico de impacto social.</p>
            <Link to="/cadastro" className="lp-btn btn-primary">Saiba mais voluntários</Link>
          </div>
          <div className="lp-col-img">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=80"
              alt="Voluntários trabalhando juntos"
            />
          </div>
        </div>
      </section>

      {/* Explorar Eventos */}
      <section id="explorar" className="lp-bg-white">
        <div className="lp-inner lp-pad">
          <h2 className="lp-title">Explorar Eventos</h2>
          <p className="lp-subtitle">Indicações de acordo com seus interesses e habilidades</p>
          <div className="lp-grid-3">
            {events.map((ev) => (
              <div key={ev.title} className="lp-event-card">
                <div className="lp-event-top">
                  <span className="tag-aberto">Aberto</span>
                  <span className="tag-match">{ev.match}</span>
                </div>
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
                <div className="lp-event-meta">
                  <span><IconCalSm /> {ev.date}</span>
                  <span><IconMapPin /> {ev.local}</span>
                  <span><IconUsers /> {ev.vagas}</span>
                </div>
                <div className="lp-event-category">
                  <span>{ev.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizadores conectam pessoas */}
      <section className="lp-bg-light">
        <div className="lp-inner lp-pad lp-two-col">
          <div className="lp-col-img">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80"
              alt="Organizador com voluntário"
            />
          </div>
          <div className="lp-col-text">
            <h2>Organizadores conectam pessoas</h2>
            <p>Crie e gerencie eventos sociais. Recrute inscritos qualificados, aprovados por participantes.</p>
            <Link to="/cadastro" className="lp-btn btn-primary">Quero organizar eventos</Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="lp-bg-green">
        <div className="lp-inner lp-pad lp-cta">
          <h2>Pronto para fazer a diferença?</h2>
          <p>Junte-se a voluntários e organizações que estão transformando comunidades.</p>
          <Link to="/cadastro" className="lp-btn btn-white btn-lg">Criar conta grátis</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p className="lp-footer-brand">GoodDeeds</p>
        <p>Plataforma de voluntariado © 2026</p>
      </footer>
    </div>
  );
}
