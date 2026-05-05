const pool = require('../config/database');
const Evento = require('../models/Evento');

class EventoRepository {
  async create({
    organizador_id,
    titulo,
    descricao,
    local,
    data_hora_inicio,
    data_hora_fim,
    numero_maximo_vagas,
    requisitos,
  }) {
    const result = await pool.query(
      `INSERT INTO eventos (
        organizador_id,
        titulo,
        descricao,
        local,
        data_hora_inicio,
        data_hora_fim,
        numero_maximo_vagas,
        requisitos
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        organizador_id,
        titulo,
        descricao,
        local,
        data_hora_inicio,
        data_hora_fim || null,
        numero_maximo_vagas,
        requisitos || null,
      ]
    );

    return new Evento(result.rows[0]);
  }

  async findAtivos() {
    const result = await pool.query(
      `SELECT e.*, u.nome AS organizador_nome
         FROM eventos e
         JOIN usuarios u ON u.id = e.organizador_id
        WHERE e.status = 'ATIVO'
        ORDER BY e.data_hora_inicio ASC`
    );

    return result.rows.map(row => new Evento(row));
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT e.*, u.nome AS organizador_nome
         FROM eventos e
         JOIN usuarios u ON u.id = e.organizador_id
        WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }

  async findByOrganizador(organizadorId) {
    const result = await pool.query(
      `SELECT e.*, u.nome AS organizador_nome
         FROM eventos e
         JOIN usuarios u ON u.id = e.organizador_id
        WHERE e.organizador_id = $1
        ORDER BY e.data_hora_inicio ASC`,
      [organizadorId]
    );

    return result.rows.map(row => new Evento(row));
  }

  async update(id, {
    titulo,
    descricao,
    local,
    data_hora_inicio,
    data_hora_fim,
    numero_maximo_vagas,
    requisitos,
  }) {
    const result = await pool.query(
      `UPDATE eventos
          SET titulo = $1,
              descricao = $2,
              local = $3,
              data_hora_inicio = $4,
              data_hora_fim = $5,
              numero_maximo_vagas = $6,
              requisitos = $7,
              updated_at = NOW()
        WHERE id = $8
        RETURNING *`,
      [
        titulo,
        descricao,
        local,
        data_hora_inicio,
        data_hora_fim || null,
        numero_maximo_vagas,
        requisitos || null,
        id,
      ]
    );

    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }

  async cancelar(id) {
    const result = await pool.query(
      `UPDATE eventos
          SET status = 'CANCELADO',
              updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return new Evento(result.rows[0]);
  }
}

module.exports = new EventoRepository();
