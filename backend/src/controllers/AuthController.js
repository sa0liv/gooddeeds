const autenticacaoService = require('../services/AutenticacaoService');
const usuarioRepository = require('../repositories/UsuarioRepository');

class AuthController {
  async registrar(req, res) {
    try {
      const { nome, email, senha, telefone } = req.body;
      const resultado = await autenticacaoService.registrar({
        nome, email, senha, telefone,
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

  async atualizarPerfil(req, res) {
    try {
      const { nome, telefone, habilidades, areas_interesse, cidade } = req.body;
      const usuario = await usuarioRepository.update(req.usuario.id, {
        nome, telefone, habilidades, areas_interesse, cidade,
      });
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
      const { senha, ...semSenha } = usuario;
      res.json(semSenha);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new AuthController();
