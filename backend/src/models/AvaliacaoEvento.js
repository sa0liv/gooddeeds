class AvaliacaoEvento {
  constructor(row) {
    this.id = row.id;
    this.eventoId = row.evento_id;
    this.voluntarioId = row.voluntario_id;
    this.organizacaoNota = row.organizacao_nota;
    this.comunicacaoNota = row.comunicacao_nota;
    this.clarezaNota = row.clareza_nota;
    this.experienciaNota = row.experiencia_nota;
    this.melhorParteTexto = row.melhor_parte_texto;
    this.pontosMelhoriaTexto = row.pontos_melhoria_texto;
    this.comentariosAdicionais = row.comentarios_adicionais;
    this.createdAt = row.created_at;
    // campos de join opcionais
    this.eventoTitulo = row.evento_titulo;
    this.voluntarioNome = row.voluntario_nome;
  }
}

module.exports = AvaliacaoEvento;
