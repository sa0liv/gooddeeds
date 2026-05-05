const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/UsuarioRepository');

const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader?.split(' ') || [];

    if (!token) {
      return res.status(401).json({ erro: 'Token nao informado' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'gooddeeds_secret');
    const usuario = await usuarioRepository.findById(payload.id);

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuario nao autenticado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token invalido' });
  }
};

module.exports = { autenticar };
