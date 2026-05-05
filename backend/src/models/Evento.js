class Evento {
  constructor({
    id,
    organizador_id,
    titulo,
    descricao,
    local,
    data_hora_inicio,
    data_hora_fim,
    numero_maximo_vagas,
    requisitos,
    status,
    organizador_nome,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.organizadorId = organizador_id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.local = local;
    this.dataHoraInicio = data_hora_inicio;
    this.dataHoraFim = data_hora_fim;
    this.numeroMaximoVagas = numero_maximo_vagas;
    this.requisitos = requisitos;
    this.status = status;
    this.organizadorNome = organizador_nome;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

module.exports = Evento;
