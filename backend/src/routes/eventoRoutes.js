const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/EventoController');
const { autenticar } = require('../middleware/auth');

router.get('/', (req, res) => eventoController.listar(req, res));
router.get('/meus', autenticar, (req, res) => eventoController.listarMeus(req, res));
router.get('/:id', (req, res) => eventoController.obter(req, res));
router.post('/', autenticar, (req, res) => eventoController.criar(req, res));
router.put('/:id', autenticar, (req, res) => eventoController.atualizar(req, res));
router.delete('/:id', autenticar, (req, res) => eventoController.deletar(req, res));

module.exports = router;
