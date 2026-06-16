const pool = require('../config/database');
const AvaliacaoEvento = require('../models/AvaliacaoEvento');

class AvaliacaoRepository {
  async create({ evento_id, voluntario_id, organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota, melhor_parte_texto, pontos_melhoria_texto, comentarios_adicionais }) {
    const result = await pool.query(
      `INSERT INTO avaliacoes
        (evento_id, voluntario_id, organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota,
         melhor_parte_texto, pontos_melhoria_texto, comentarios_adicionais)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [evento_id, voluntario_id, organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota,
       melhor_parte_texto || null, pontos_melhoria_texto || null, comentarios_adicionais || null]
    );
    return new AvaliacaoEvento(result.rows[0]);
  }

  async findByVoluntarioEEvento(voluntario_id, evento_id) {
    const result = await pool.query(
      'SELECT * FROM avaliacoes WHERE voluntario_id = $1 AND evento_id = $2',
      [voluntario_id, evento_id]
    );
    return result.rows.length > 0 ? new AvaliacaoEvento(result.rows[0]) : null;
  }

  async findByVoluntarioId(voluntario_id) {
    const result = await pool.query(
      `SELECT a.*, e.titulo AS evento_titulo
       FROM avaliacoes a
       JOIN eventos e ON a.evento_id = e.id
       WHERE a.voluntario_id = $1
       ORDER BY a.created_at DESC`,
      [voluntario_id]
    );
    return result.rows.map(r => new AvaliacaoEvento(r));
  }

  async findByEventoId(evento_id) {
    const result = await pool.query(
      `SELECT a.*, u.nome AS voluntario_nome
       FROM avaliacoes a
       JOIN usuarios u ON a.voluntario_id = u.id
       WHERE a.evento_id = $1
       ORDER BY a.created_at DESC`,
      [evento_id]
    );
    return result.rows.map(r => new AvaliacaoEvento(r));
  }

  async getResumoByEvento(evento_id) {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int                              AS total_avaliacoes,
         ROUND(AVG(organizacao_nota)::numeric, 1)  AS media_organizacao,
         ROUND(AVG(comunicacao_nota)::numeric, 1)  AS media_comunicacao,
         ROUND(AVG(clareza_nota)::numeric, 1)      AS media_clareza,
         ROUND(AVG(experiencia_nota)::numeric, 1)  AS media_experiencia,
         ROUND(AVG((organizacao_nota + comunicacao_nota + clareza_nota + experiencia_nota)::numeric / 4), 1) AS media_geral
       FROM avaliacoes
       WHERE evento_id = $1`,
      [evento_id]
    );
    const textos = await pool.query(
      `SELECT melhor_parte_texto, pontos_melhoria_texto, comentarios_adicionais
       FROM avaliacoes WHERE evento_id = $1`,
      [evento_id]
    );
    return { resumo: result.rows[0], comentarios: textos.rows };
  }

  async createAvaliacaoVoluntario({
    evento_id,
    voluntario_id,
    organizador_id,
    pontualidade_nota,
    colaboracao_nota,
    comprometimento_nota,
    desempenho_nota,
    pontos_fortes_texto,
    pontos_melhoria_texto,
    comentarios_adicionais,
  }) {
    const result = await pool.query(
      `INSERT INTO avaliacoes_voluntarios
        (evento_id, voluntario_id, organizador_id, pontualidade_nota, colaboracao_nota,
         comprometimento_nota, desempenho_nota, pontos_fortes_texto, pontos_melhoria_texto,
         comentarios_adicionais)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        evento_id,
        voluntario_id,
        organizador_id,
        pontualidade_nota,
        colaboracao_nota,
        comprometimento_nota,
        desempenho_nota,
        pontos_fortes_texto || null,
        pontos_melhoria_texto || null,
        comentarios_adicionais || null,
      ]
    );
    return result.rows[0];
  }

  async findAvaliacaoVoluntario(organizador_id, voluntario_id, evento_id) {
    const result = await pool.query(
      `SELECT *
       FROM avaliacoes_voluntarios
       WHERE organizador_id = $1
         AND voluntario_id = $2
         AND evento_id = $3`,
      [organizador_id, voluntario_id, evento_id]
    );
    return result.rows[0] || null;
  }

  async getResumoByVoluntario(voluntario_id) {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int AS total_avaliacoes,
         ROUND(AVG(pontualidade_nota)::numeric, 1) AS media_pontualidade,
         ROUND(AVG(colaboracao_nota)::numeric, 1) AS media_colaboracao,
         ROUND(AVG(comprometimento_nota)::numeric, 1) AS media_comprometimento,
         ROUND(AVG(desempenho_nota)::numeric, 1) AS media_desempenho,
         ROUND(AVG((pontualidade_nota + colaboracao_nota + comprometimento_nota + desempenho_nota)::numeric / 4), 1) AS media_geral
       FROM avaliacoes_voluntarios
       WHERE voluntario_id = $1`,
      [voluntario_id]
    );
    return result.rows[0];
  }
}

module.exports = new AvaliacaoRepository();
