const inscricaoRepository = require('../repositories/InscricaoRepository');
const eventoRepository = require('../repositories/EventoRepository');

class InscricaoService {
  async inscreverEmEvento(usuario_id, evento_id) {
    const jaInscrito = await inscricaoRepository.findByUsuarioEEvento(usuario_id, evento_id);
    if (jaInscrito) throw new Error('Você já está inscrito neste evento');

    const evento = await eventoRepository.findById(evento_id);
    if (!evento) throw new Error('Evento não encontrado');

    const vagasOcupadas = await inscricaoRepository.countByEvento(evento_id, 'CONFIRMADA');
    if (vagasOcupadas >= evento.vagas) throw new Error('Sem vagas disponíveis');

    return inscricaoRepository.create({ usuario_id, evento_id, status: 'PENDENTE' });
  }

  async obterInscricao(id) {
    const inscricao = await inscricaoRepository.findById(id);
    if (!inscricao) throw new Error('Inscrição não encontrada');
    return inscricao;
  }

  async listarInscricoesDoUsuario(usuario_id) {
    return inscricaoRepository.findWithEventoData(usuario_id);
  }

  async listarInscricoesDoEvento(evento_id, criador_id) {
    const evento = await eventoRepository.findById(evento_id);
    if (!evento) throw new Error('Evento não encontrado');
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    return inscricaoRepository.findWithUsuarioData(evento_id);
  }

  async aprovarInscricao(inscricao_id, criador_id) {
    const inscricao = await inscricaoRepository.findById(inscricao_id);
    if (!inscricao) throw new Error('Inscrição não encontrada');

    const evento = await eventoRepository.findById(inscricao.eventoId);
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    return inscricaoRepository.update(inscricao_id, { status: 'CONFIRMADA' });
  }

  async recusarInscricao(inscricao_id, criador_id) {
    const inscricao = await inscricaoRepository.findById(inscricao_id);
    if (!inscricao) throw new Error('Inscrição não encontrada');

    const evento = await eventoRepository.findById(inscricao.eventoId);
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    return inscricaoRepository.update(inscricao_id, { status: 'CANCELADA' });
  }

  async cancelarInscricao(inscricao_id, usuario_id) {
    const inscricao = await inscricaoRepository.findById(inscricao_id);
    if (!inscricao) throw new Error('Inscrição não encontrada');
    if (inscricao.usuarioId !== usuario_id) throw new Error('Permissão negada');

    return inscricaoRepository.delete(inscricao_id);
  }

  async registrarPresenca(inscricao_id, criador_id, presente) {
    const inscricao = await inscricaoRepository.findById(inscricao_id);
    if (!inscricao) throw new Error('Inscrição não encontrada');
    if (inscricao.status !== 'CONFIRMADA') throw new Error('Inscrição não confirmada');

    const evento = await eventoRepository.findById(inscricao.eventoId);
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    return inscricaoRepository.updatePresenca(inscricao_id, presente);
  }

  async historicoParticipacoes(usuario_id) {
    return inscricaoRepository.findHistoricoByUsuario(usuario_id);
  }

  async contarInscricoesPorEvento(evento_id) {
    const total = await inscricaoRepository.countByEvento(evento_id);
    const confirmadas = await inscricaoRepository.countByEvento(evento_id, 'CONFIRMADA');
    const pendentes = await inscricaoRepository.countByEvento(evento_id, 'PENDENTE');
    const canceladas = await inscricaoRepository.countByEvento(evento_id, 'CANCELADA');

    return { total, confirmadas, pendentes, canceladas };
  }
}

module.exports = new InscricaoService();
