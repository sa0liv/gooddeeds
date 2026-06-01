const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/UsuarioRepository');

class AutenticacaoService {
  async registrar({ nome, email, senha, telefone }) {
    const existente = await usuarioRepository.findByEmail(email);
    if (existente) {
      throw new Error('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await usuarioRepository.create({
      nome,
      email,
      senha: senhaHash,
      telefone,
      tipo_perfil: 'VOLUNTARIO',
    });

    const token = this._gerarToken(usuario);
    return { usuario: this._omitirSenha(usuario), token };
  }

  async login({ email, senha }) {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    const token = this._gerarToken(usuario);
    return { usuario: this._omitirSenha(usuario), token };
  }

  _gerarToken(usuario) {
    return jwt.sign(
      { id: usuario.id, email: usuario.email, tipoPerfil: usuario.tipoPerfil },
      process.env.JWT_SECRET || 'gooddeeds_secret',
      { expiresIn: '7d' }
    );
  }

  _omitirSenha({ senha, ...semSenha }) {
    return semSenha;
  }
}

module.exports = new AutenticacaoService();
