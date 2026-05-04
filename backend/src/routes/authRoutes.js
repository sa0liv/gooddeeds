const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { validarCadastro, validarLogin } = require('../middleware/validate');

router.post('/registrar', validarCadastro, (req, res) => authController.registrar(req, res));
router.post('/login', validarLogin, (req, res) => authController.login(req, res));

module.exports = router;
