const avaliacaoRepository = require('../repositories/AvaliacaoRepository');
const inscricaoRepository = require('../repositories/InscricaoRepository');
const eventoRepository = require('../repositories/EventoRepository');

const STOPWORDS = new Set([
  'de', 'a', 'o', 'e', 'que', 'para', 'com', 'foi', 'muito', 'um', 'uma',
  'os', 'as', 'em', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas',
  'se', 'por', 'mas', 'ao', 'à', 'isso', 'mais', 'eu', 'ele', 'ela',
  'nós', 'eles', 'elas', 'me', 'te', 'lhe', 'nos', 'ser', 'ter', 'há',
  'já', 'não', 'sim', 'bem', 'só', 'até', 'quando', 'como', 'também',
]);

class AvaliacaoService {
  async criarAvaliacao(voluntario_id, dados) {
    const { evento_id, organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota,
            melhor_parte_texto, pontos_melhoria_texto, comentarios_adicionais } = dados;

    const inscricao = await inscricaoRepository.findByUsuarioEEvento(voluntario_id, evento_id);
    if (!inscricao) throw new Error('Você não está inscrito neste evento');
    if (inscricao.status !== 'CONFIRMADA') throw new Error('Sua inscrição precisa estar confirmada para avaliar');
    if (inscricao.presenca !== true) throw new Error('Sua presença precisa estar confirmada para avaliar');

    const jaAvaliou = await avaliacaoRepository.findByVoluntarioEEvento(voluntario_id, evento_id);
    if (jaAvaliou) throw new Error('Você já avaliou este evento');

    const notas = [organizacao_nota, comunicacao_nota, clareza_nota, experiencia_nota];
    if (notas.some(n => !n || n < 1 || n > 5)) {
      throw new Error('Todas as notas devem ser entre 1 e 5');
    }

    return avaliacaoRepository.create({
      evento_id, voluntario_id,
      organizacao_nota: parseInt(organizacao_nota),
      comunicacao_nota: parseInt(comunicacao_nota),
      clareza_nota: parseInt(clareza_nota),
      experiencia_nota: parseInt(experiencia_nota),
      melhor_parte_texto,
      pontos_melhoria_texto,
      comentarios_adicionais,
    });
  }

  async verificarAvaliacao(voluntario_id, evento_id) {
    return avaliacaoRepository.findByVoluntarioEEvento(voluntario_id, evento_id);
  }

  async minhasAvaliacoes(voluntario_id) {
    return avaliacaoRepository.findByVoluntarioId(voluntario_id);
  }

  async avaliacoesDoEvento(evento_id, criador_id) {
    const evento = await eventoRepository.findById(evento_id);
    if (!evento) throw new Error('Evento não encontrado');
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    return avaliacaoRepository.findByEventoId(evento_id);
  }

  async resumoAvaliacoes(evento_id, criador_id) {
    const evento = await eventoRepository.findById(evento_id);
    if (!evento) throw new Error('Evento não encontrado');
    if (evento.criadorId !== criador_id) throw new Error('Permissão negada');

    const { resumo, comentarios } = await avaliacaoRepository.getResumoByEvento(evento_id);

    const todosTextos = comentarios.flatMap(c => [
      c.melhor_parte_texto || '',
      c.pontos_melhoria_texto || '',
      c.comentarios_adicionais || '',
    ]).join(' ');

    const palavrasFrequentes = this._contarPalavras(todosTextos);

    return {
      totalAvaliacoes: resumo.total_avaliacoes,
      mediaGeral: parseFloat(resumo.media_geral) || 0,
      mediaOrganizacao: parseFloat(resumo.media_organizacao) || 0,
      mediaComunicacao: parseFloat(resumo.media_comunicacao) || 0,
      mediaClareza: parseFloat(resumo.media_clareza) || 0,
      mediaExperiencia: parseFloat(resumo.media_experiencia) || 0,
      comentarios,
      palavrasFrequentes,
    };
  }

  async criarAvaliacaoVoluntario(organizador_id, dados) {
    const {
      evento_id,
      voluntario_id,
      pontualidade_nota,
      colaboracao_nota,
      comprometimento_nota,
      desempenho_nota,
      pontos_fortes_texto,
      pontos_melhoria_texto,
      comentarios_adicionais,
    } = dados;

    const evento = await eventoRepository.findById(evento_id);
    if (!evento) throw new Error('Evento não encontrado');
    if (String(evento.criadorId) !== String(organizador_id)) throw new Error('Permissão negada');

    const inscricao = await inscricaoRepository.findByUsuarioEEvento(voluntario_id, evento_id);
    if (!inscricao) throw new Error('Voluntário não inscrito neste evento');
    if (inscricao.status !== 'CONFIRMADA') throw new Error('A inscrição precisa estar confirmada para avaliar');
    if (inscricao.presenca !== true) throw new Error('A presença precisa estar confirmada para avaliar');

    const jaAvaliou = await avaliacaoRepository.findAvaliacaoVoluntario(
      organizador_id,
      voluntario_id,
      evento_id
    );
    if (jaAvaliou) throw new Error('Você já avaliou este voluntário neste evento');

    const notas = [pontualidade_nota, colaboracao_nota, comprometimento_nota, desempenho_nota];
    if (notas.some(n => !n || n < 1 || n > 5)) {
      throw new Error('Todas as notas devem ser entre 1 e 5');
    }

    return avaliacaoRepository.createAvaliacaoVoluntario({
      evento_id,
      voluntario_id,
      organizador_id,
      pontualidade_nota: parseInt(pontualidade_nota),
      colaboracao_nota: parseInt(colaboracao_nota),
      comprometimento_nota: parseInt(comprometimento_nota),
      desempenho_nota: parseInt(desempenho_nota),
      pontos_fortes_texto,
      pontos_melhoria_texto,
      comentarios_adicionais,
    });
  }

  async verificarAvaliacaoVoluntario(organizador_id, evento_id, voluntario_id) {
    return avaliacaoRepository.findAvaliacaoVoluntario(organizador_id, voluntario_id, evento_id);
  }

  async resumoAvaliacaoVoluntario(voluntario_id) {
    const resumo = await avaliacaoRepository.getResumoByVoluntario(voluntario_id);
    return {
      totalAvaliacoes: resumo.total_avaliacoes,
      mediaGeral: parseFloat(resumo.media_geral) || 0,
      mediaPontualidade: parseFloat(resumo.media_pontualidade) || 0,
      mediaColaboracao: parseFloat(resumo.media_colaboracao) || 0,
      mediaComprometimento: parseFloat(resumo.media_comprometimento) || 0,
      mediaDesempenho: parseFloat(resumo.media_desempenho) || 0,
    };
  }

  _contarPalavras(texto) {
    const palavras = texto
      .toLowerCase()
      .replace(/[^a-záéíóúàâêôãõüç\s]/gi, ' ')
      .split(/\s+/)
      .filter(p => p.length > 2 && !STOPWORDS.has(p));

    const freq = {};
    for (const p of palavras) {
      freq[p] = (freq[p] || 0) + 1;
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([palavra, contagem]) => ({ palavra, contagem }));
  }
}

module.exports = new AvaliacaoService();
