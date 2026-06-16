const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/AvaliacaoController');
const { autenticar } = require('../middleware/auth');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', autenticar, asyncHandler((req, res) => avaliacaoController.criar(req, res)));
router.post('/voluntario', autenticar, asyncHandler((req, res) => avaliacaoController.criarVoluntario(req, res)));
router.get('/minhas', autenticar, asyncHandler((req, res) => avaliacaoController.minhas(req, res)));
router.get('/voluntario/resumo/:voluntarioId', autenticar, asyncHandler((req, res) => avaliacaoController.resumoVoluntario(req, res)));
router.get('/voluntario/verificar/:eventoId/:voluntarioId', autenticar, asyncHandler((req, res) => avaliacaoController.verificarVoluntario(req, res)));
router.get('/verificar/:eventoId', autenticar, asyncHandler((req, res) => avaliacaoController.verificar(req, res)));

module.exports = router;
