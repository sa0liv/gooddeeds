const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'gooddeeds_secret');
    req.usuario = payload;
    next();
  } catch (error) {
    res.status(403).json({ erro: 'Token inválido' });
  }
};

module.exports = { autenticar };
