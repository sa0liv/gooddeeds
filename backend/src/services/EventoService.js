const eventoRepository = require('../repositories/EventoRepository');

class EventoService {
  async criarEvento({ titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades }, usuarioId) {
    if (!titulo || !descricao || !categoria || !cidade || !local || !data || !horario || !vagas) {
      throw new Error('Campos obrigatórios não preenchidos');
    }

    if (vagas <= 0) {
      throw new Error('Vagas deve ser maior que 0');
    }

    const evento = await eventoRepository.create({
      titulo,
      descricao,
      categoria,
      cidade,
      local,
      data,
      horario,
      vagas: parseInt(vagas),
      carga_horaria: carga_horaria ? parseFloat(carga_horaria) : null,
      requisitos,
      habilidades: Array.isArray(habilidades) ? habilidades : [],
      criador_id: usuarioId,
    });

    return evento;
  }

  async obterEvento(id) {
    const evento = await eventoRepository.findById(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }
    return evento;
  }

  async listarEventos() {
    return await eventoRepository.findAll();
  }

  async listarEventosDoUsuario(usuarioId) {
    return await eventoRepository.findByCreador(usuarioId);
  }

  async listarEventosPorCategoria(categoria) {
    return await eventoRepository.findByCategoria(categoria);
  }

  async listarEventosPorCidade(cidade) {
    return await eventoRepository.findByCidade(cidade);
  }

  async atualizarEvento(id, dados, usuarioId) {
    const evento = await eventoRepository.findById(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.criadorId !== usuarioId) {
      throw new Error('Permissão negada');
    }

    const eventoAtualizado = await eventoRepository.update(id, dados);
    return eventoAtualizado;
  }

  async deletarEvento(id, usuarioId) {
    const evento = await eventoRepository.findById(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.criadorId !== usuarioId) {
      throw new Error('Permissão negada');
    }

    return await eventoRepository.delete(id);
  }

  async encerrarEvento(id, usuarioId) {
    const evento = await eventoRepository.findById(id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.criadorId !== usuarioId) {
      throw new Error('Permissão negada');
    }

    if (evento.status === 'ENCERRADO') {
      throw new Error('Evento já está encerrado');
    }

    return await eventoRepository.encerrar(id);
  }
}

module.exports = new EventoService();
