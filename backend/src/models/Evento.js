class Evento {
  constructor({ id, titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades, criador_id, created_at, updated_at, criador_nome, criador_email, media_organizador, total_avaliacoes_organizador, status }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.categoria = categoria;
    this.cidade = cidade;
    this.local = local;
    this.data = data;
    this.horario = horario;
    this.vagas = vagas;
    this.cargaHoraria = carga_horaria;
    this.requisitos = requisitos;
    this.habilidades = habilidades;
    this.criadorId = criador_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.criador_nome = criador_nome;
    this.criador_email = criador_email;
    this.mediaOrganizador = media_organizador != null ? parseFloat(media_organizador) : null;
    this.totalAvaliacoesOrganizador = total_avaliacoes_organizador || 0;
    this.status = status || 'ATIVO';
  }
}

module.exports = Evento;
