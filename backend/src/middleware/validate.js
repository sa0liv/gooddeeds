const { body, validationResult } = require('express-validator');

const checarErros = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }
  next();
};

const validarCadastro = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('telefone')
    .optional({ checkFalsy: true })
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
  body('tipo_perfil')
    .optional()
    .isIn(['VOLUNTARIO', 'ORGANIZADOR'])
    .withMessage('Tipo de perfil inválido'),
  checarErros,
];

const validarLogin = [
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
  checarErros,
];

module.exports = { validarCadastro, validarLogin };
