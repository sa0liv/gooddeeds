class Usuario {
  constructor({ id, nome, email, senha, telefone, tipo_perfil, habilidades, areas_interesse, cidade, created_at }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.tipoPerfil = tipo_perfil;
    this.habilidades = habilidades || [];
    this.areas_interesse = areas_interesse || [];
    this.cidade = cidade || null;
    this.createdAt = created_at;
  }
}

module.exports = Usuario;
