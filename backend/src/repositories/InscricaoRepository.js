const pool = require('../config/database');
const Inscricao = require('../models/Inscricao');

class InscricaoRepository {
  async create({ usuario_id, evento_id, status = 'PENDENTE' }) {
    const result = await pool.query(
      `INSERT INTO inscricoes (usuario_id, evento_id, status) VALUES ($1, $2, $3) RETURNING *`,
      [usuario_id, evento_id, status]
    );
    return new Inscricao(result.rows[0]);
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM inscricoes WHERE id = $1', [id]);
    return result.rows.length > 0 ? new Inscricao(result.rows[0]) : null;
  }

  async findByUsuarioId(usuario_id) {
    const result = await pool.query(
      'SELECT * FROM inscricoes WHERE usuario_id = $1 ORDER BY created_at DESC',
      [usuario_id]
    );
    return result.rows.map(row => new Inscricao(row));
  }

  async findByEventoId(evento_id) {
    const result = await pool.query(
      'SELECT * FROM inscricoes WHERE evento_id = $1 ORDER BY created_at DESC',
      [evento_id]
    );
    return result.rows.map(row => new Inscricao(row));
  }

  async findByUsuarioEEvento(usuario_id, evento_id) {
    const result = await pool.query(
      'SELECT * FROM inscricoes WHERE usuario_id = $1 AND evento_id = $2',
      [usuario_id, evento_id]
    );
    return result.rows.length > 0 ? new Inscricao(result.rows[0]) : null;
  }

  async update(id, { status }) {
    const result = await pool.query(
      'UPDATE inscricoes SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows.length > 0 ? new Inscricao(result.rows[0]) : null;
  }

  async updatePresenca(id, presenca) {
    const result = await pool.query(
      'UPDATE inscricoes SET presenca = $1 WHERE id = $2 RETURNING *',
      [presenca, id]
    );
    return result.rows.length > 0 ? new Inscricao(result.rows[0]) : null;
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM inscricoes WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  async findWithEventoData(usuario_id) {
    const result = await pool.query(
      `SELECT i.*, e.titulo, e.data, e.horario, e.local, e.categoria, e.cidade,
              e.habilidades, u.nome as criador_nome, u.email as criador_email
       FROM inscricoes i
       JOIN eventos e ON i.evento_id = e.id
       JOIN usuarios u ON e.criador_id = u.id
       WHERE i.usuario_id = $1
       ORDER BY i.created_at DESC`,
      [usuario_id]
    );
    return result.rows;
  }

  async findWithUsuarioData(evento_id) {
    const result = await pool.query(
      `SELECT i.*, u.nome, u.email, u.telefone, u.habilidades, u.areas_interesse, u.cidade
       FROM inscricoes i
       JOIN usuarios u ON i.usuario_id = u.id
       WHERE i.evento_id = $1
       ORDER BY i.created_at DESC`,
      [evento_id]
    );
    return result.rows;
  }

  async countByEvento(evento_id, status = null) {
    const query = status
      ? 'SELECT COUNT(*) as count FROM inscricoes WHERE evento_id = $1 AND status = $2'
      : 'SELECT COUNT(*) as count FROM inscricoes WHERE evento_id = $1';
    const params = status ? [evento_id, status] : [evento_id];
    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = new InscricaoRepository();
