const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/EventoController');
const { autenticar } = require('../middleware/autenticacao');
const { validarEvento, validarIdEvento } = require('../middleware/validate');

router.get('/eventos', (req, res) => eventoController.listar(req, res));
router.get('/eventos/:id', validarIdEvento, (req, res) => eventoController.detalhar(req, res));
router.post('/eventos', autenticar, validarEvento, (req, res) => eventoController.criar(req, res));
router.get('/meus-eventos', autenticar, (req, res) => eventoController.meusEventos(req, res));
router.put('/eventos/:id', autenticar, validarIdEvento, validarEvento, (req, res) => eventoController.atualizar(req, res));
router.patch('/eventos/:id/cancelar', autenticar, validarIdEvento, (req, res) => eventoController.cancelar(req, res));
router.delete('/eventos/:id', autenticar, validarIdEvento, (req, res) => eventoController.cancelar(req, res));

module.exports = router;
