class Usuario {
  constructor({ id, nome, email, senha, telefone, tipo_perfil, created_at }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.tipoPerfil = tipo_perfil;
    this.createdAt = created_at;
  }
}

module.exports = Usuario;
