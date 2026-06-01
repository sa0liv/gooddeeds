class Inscricao {
  constructor({ id, usuario_id, evento_id, status, presenca, created_at }) {
    this.id = id;
    this.usuarioId = usuario_id;
    this.eventoId = evento_id;
    this.status = status;
    this.presenca = presenca ?? null;
    this.createdAt = created_at;
  }
}

module.exports = Inscricao;
