const autenticacaoService = require('../services/AutenticacaoService');

class AuthController {
  async registrar(req, res) {
    try {
      const { nome, email, senha, telefone, tipo_perfil } = req.body;
      const resultado = await autenticacaoService.registrar({
        nome, email, senha, telefone, tipo_perfil,
      });
      res.status(201).json(resultado);
    } catch (error) {
      if (error.message === 'E-mail já cadastrado') {
        return res.status(409).json({ erro: error.message });
      }
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await autenticacaoService.login({ email, senha });
      res.json(resultado);
    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        return res.status(401).json({ erro: error.message });
      }
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AuthController();
