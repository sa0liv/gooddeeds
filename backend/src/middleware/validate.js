const { body, param, validationResult } = require('express-validator');

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

const validarEvento = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Titulo e obrigatorio')
    .isLength({ max: 255 })
    .withMessage('Titulo deve ter no maximo 255 caracteres'),
  body('descricao')
    .trim()
    .notEmpty()
    .withMessage('Descricao e obrigatoria'),
  body('local')
    .trim()
    .notEmpty()
    .withMessage('Local e obrigatorio')
    .isLength({ max: 255 })
    .withMessage('Local deve ter no maximo 255 caracteres'),
  body('data_hora_inicio')
    .isISO8601()
    .withMessage('Data/hora de inicio invalida'),
  body('data_hora_fim')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Data/hora de fim invalida')
    .custom((dataHoraFim, { req }) => {
      if (!dataHoraFim) return true;
      return new Date(dataHoraFim) > new Date(req.body.data_hora_inicio);
    })
    .withMessage('Data/hora de fim deve ser posterior ao inicio'),
  body('numero_maximo_vagas')
    .isInt({ min: 1 })
    .withMessage('Numero maximo de vagas deve ser maior que zero')
    .toInt(),
  body('requisitos')
    .optional({ checkFalsy: true })
    .trim(),
  checarErros,
];

const validarIdEvento = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID do evento invalido')
    .toInt(),
  checarErros,
];

module.exports = {
  validarCadastro,
  validarLogin,
  validarEvento,
  validarIdEvento,
};
