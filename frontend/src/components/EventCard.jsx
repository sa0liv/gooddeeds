function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

const INSCRICAO_STATUS = {
  PENDENTE:   { label: 'Pendente',  color: '#f59e0b' },
  CONFIRMADA: { label: 'Aprovado',  color: '#2e9e6a' },
  CANCELADA:  { label: 'Recusado',  color: '#f44336' },
};

export default function EventCard({
  evento,
  compatibilidade = null,
  showCompatibilidade = false,
  actions = [],
  inscricao = null,
}) {
  const formatData = (dateStr) => {
    if (!dateStr) return '';
    return String(dateStr).split('T')[0];
  };

  const badge = inscricao
    ? (INSCRICAO_STATUS[inscricao.status] || { label: inscricao.status, color: '#67737e' })
    : { label: evento.vagas > 0 ? 'Aberto' : 'Completo', color: evento.vagas > 0 ? '#2e9e6a' : '#999' };

  const matchColor =
    compatibilidade >= 50 ? '#2e9e6a' :
    compatibilidade >= 25 ? '#f59e0b' : '#67737e';

  return (
    <div className="event-card">
      <div className="event-card-top-row">
        <span className="event-card-badge" style={{ backgroundColor: badge.color }}>
          {badge.label}
        </span>
        {showCompatibilidade && compatibilidade !== null && (
          <span className="event-card-match" style={{ color: matchColor }}>
            {compatibilidade}% match
          </span>
        )}
      </div>

      <h3 className="event-card-title">{evento.titulo}</h3>

      {evento.descricao && (
        <p className="event-card-desc">{evento.descricao}</p>
      )}

      <div className="event-card-info">
        <div className="event-info-row">
          <span className="event-info-icon"><CalendarIcon /></span>
          <span className="event-info-text">{formatData(evento.data)} às {evento.horario}</span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon"><PinIcon /></span>
          <span className="event-info-text">
            {evento.cidade}{evento.local ? ` — ${evento.local}` : ''}
          </span>
        </div>
        <div className="event-info-row">
          <span className="event-info-icon"><PeopleIcon /></span>
          <span className="event-info-text">{evento.vagas} vagas</span>
        </div>
      </div>

      {evento.categoria && (
        <div className="event-card-tags">
          <span className="event-card-tag">{evento.categoria}</span>
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className="event-card-actions">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={`event-card-btn ${action.variant || 'primary'}`}
              onClick={action.onClick}
              disabled={action.disabled || false}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
