const eventoRepository = require('../repositories/EventoRepository');

class EventoService {
  async criar(usuario, dados) {
    this._validarOrganizador(usuario);

    return eventoRepository.create({
      ...dados,
      organizador_id: usuario.id,
    });
  }

  async listarAtivos() {
    return eventoRepository.findAtivos();
  }

  async detalharAtivo(id) {
    const evento = await eventoRepository.findById(id);
    if (!evento || evento.status !== 'ATIVO') {
      throw new Error('Evento nao encontrado');
    }

    return evento;
  }

  async listarMeusEventos(usuario) {
    this._validarOrganizador(usuario);
    return eventoRepository.findByOrganizador(usuario.id);
  }

  async atualizar(id, usuario, dados) {
    this._validarOrganizador(usuario);

    const evento = await this._buscarEventoDoOrganizador(id, usuario);
    if (evento.status === 'CANCELADO') {
      throw new Error('Evento cancelado nao pode ser editado');
    }

    return eventoRepository.update(id, dados);
  }

  async cancelar(id, usuario) {
    this._validarOrganizador(usuario);
    await this._buscarEventoDoOrganizador(id, usuario);
    return eventoRepository.cancelar(id);
  }

  _validarOrganizador(usuario) {
    if (!usuario || usuario.tipoPerfil !== 'ORGANIZADOR') {
      throw new Error('Apenas organizadores podem executar esta acao');
    }
  }

  async _buscarEventoDoOrganizador(id, usuario) {
    const evento = await eventoRepository.findById(id);
    if (!evento) {
      throw new Error('Evento nao encontrado');
    }

    if (Number(evento.organizadorId) !== Number(usuario.id)) {
      throw new Error('Voce nao tem permissao para alterar este evento');
    }

    return evento;
  }
}

module.exports = new EventoService();
