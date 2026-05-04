const pool = require('../config/database');
const Usuario = require('../models/Usuario');

class UsuarioRepository {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) return null;
    return new Usuario(result.rows[0]);
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return new Usuario(result.rows[0]);
  }

  async create({ nome, email, senha, telefone, tipo_perfil }) {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, telefone, tipo_perfil)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nome, email, senha, telefone || null, tipo_perfil]
    );
    return new Usuario(result.rows[0]);
  }
}

module.exports = new UsuarioRepository();
