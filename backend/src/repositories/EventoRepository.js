const pool = require('../config/database');
const Evento = require('../models/Evento');

class EventoRepository {
  async create({ titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades, criador_id }) {
    const result = await pool.query(
      `INSERT INTO eventos (titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades, criador_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria || null, requisitos || null, habilidades || [], criador_id]
    );
    return new Evento(result.rows[0]);
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT e.*, u.nome as criador_nome, u.email as criador_email,
         org.media_organizador, org.total_avaliacoes_organizador
       FROM eventos e
       JOIN usuarios u ON e.criador_id = u.id
       LEFT JOIN (
         SELECT e2.criador_id,
           ROUND(AVG((av.organizacao_nota + av.comunicacao_nota + av.clareza_nota + av.experiencia_nota)::numeric / 4), 1) AS media_organizador,
           COUNT(av.id)::int AS total_avaliacoes_organizador
         FROM avaliacoes av
         JOIN eventos e2 ON av.evento_id = e2.id
         GROUP BY e2.criador_id
       ) org ON org.criador_id = e.criador_id
       WHERE e.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }

  async findAll() {
    const result = await pool.query(
      `SELECT e.*,
         org.media_organizador, org.total_avaliacoes_organizador
       FROM eventos e
       LEFT JOIN (
         SELECT e2.criador_id,
           ROUND(AVG((av.organizacao_nota + av.comunicacao_nota + av.clareza_nota + av.experiencia_nota)::numeric / 4), 1) AS media_organizador,
           COUNT(av.id)::int AS total_avaliacoes_organizador
         FROM avaliacoes av
         JOIN eventos e2 ON av.evento_id = e2.id
         GROUP BY e2.criador_id
       ) org ON org.criador_id = e.criador_id
       ORDER BY CASE WHEN e.status = 'ENCERRADO' THEN 1 ELSE 0 END ASC, e.data ASC`
    );
    return result.rows.map(row => new Evento(row));
  }

  async encerrar(id) {
    const result = await pool.query(
      `UPDATE eventos SET status = 'ENCERRADO', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }

  async findByCreador(criador_id) {
    const result = await pool.query('SELECT * FROM eventos WHERE criador_id = $1 ORDER BY data ASC', [criador_id]);
    return result.rows.map(row => new Evento(row));
  }

  async findByCategoria(categoria) {
    const result = await pool.query(
      `SELECT e.*,
         org.media_organizador, org.total_avaliacoes_organizador
       FROM eventos e
       LEFT JOIN (
         SELECT e2.criador_id,
           ROUND(AVG((av.organizacao_nota + av.comunicacao_nota + av.clareza_nota + av.experiencia_nota)::numeric / 4), 1) AS media_organizador,
           COUNT(av.id)::int AS total_avaliacoes_organizador
         FROM avaliacoes av
         JOIN eventos e2 ON av.evento_id = e2.id
         GROUP BY e2.criador_id
       ) org ON org.criador_id = e.criador_id
       WHERE e.categoria = $1
       ORDER BY e.data ASC`,
      [categoria]
    );
    return result.rows.map(row => new Evento(row));
  }

  async findByCidade(cidade) {
    const result = await pool.query(
      `SELECT e.*,
         org.media_organizador, org.total_avaliacoes_organizador
       FROM eventos e
       LEFT JOIN (
         SELECT e2.criador_id,
           ROUND(AVG((av.organizacao_nota + av.comunicacao_nota + av.clareza_nota + av.experiencia_nota)::numeric / 4), 1) AS media_organizador,
           COUNT(av.id)::int AS total_avaliacoes_organizador
         FROM avaliacoes av
         JOIN eventos e2 ON av.evento_id = e2.id
         GROUP BY e2.criador_id
       ) org ON org.criador_id = e.criador_id
       WHERE e.cidade = $1
       ORDER BY e.data ASC`,
      [cidade]
    );
    return result.rows.map(row => new Evento(row));
  }

  async update(id, { titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades }) {
    const result = await pool.query(
      `UPDATE eventos
       SET titulo = $1, descricao = $2, categoria = $3, cidade = $4, local = $5, data = $6, horario = $7, vagas = $8, carga_horaria = $9, requisitos = $10, habilidades = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria || null, requisitos || null, habilidades || [], id]
    );
    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM eventos WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}

module.exports = new EventoRepository();
