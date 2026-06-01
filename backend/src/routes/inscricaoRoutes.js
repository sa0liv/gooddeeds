const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/InscricaoController');
const { autenticar } = require('../middleware/auth');

router.post('/', autenticar, (req, res) => inscricaoController.inscrever(req, res));
router.get('/', autenticar, (req, res) => inscricaoController.minhasInscricoes(req, res));
router.get('/evento/:evento_id', autenticar, (req, res) => inscricaoController.inscricoesDoEvento(req, res));
router.put('/:id/aprovar', autenticar, (req, res) => inscricaoController.aprovar(req, res));
router.put('/:id/recusar', autenticar, (req, res) => inscricaoController.recusar(req, res));
router.put('/:id/presenca', autenticar, (req, res) => inscricaoController.registrarPresenca(req, res));
router.delete('/:id', autenticar, (req, res) => inscricaoController.cancelar(req, res));

module.exports = router;
