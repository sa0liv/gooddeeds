const avaliacaoService = require('../services/AvaliacaoService');

class AvaliacaoController {
  async criar(req, res) {
    try {
      const voluntario_id = req.usuario.id;
      const avaliacao = await avaliacaoService.criarAvaliacao(voluntario_id, req.body);
      res.status(201).json(avaliacao);
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async verificar(req, res) {
    try {
      const voluntario_id = req.usuario.id;
      const { eventoId } = req.params;
      const avaliacao = await avaliacaoService.verificarAvaliacao(voluntario_id, eventoId);
      res.json({ jaAvaliou: !!avaliacao, avaliacao: avaliacao || null });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao verificar avaliação' });
    }
  }

  async minhas(req, res) {
    try {
      const voluntario_id = req.usuario.id;
      const avaliacoes = await avaliacaoService.minhasAvaliacoes(voluntario_id);
      res.json(avaliacoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar avaliações' });
    }
  }

  async doEvento(req, res) {
    try {
      const { id } = req.params;
      const criador_id = req.usuario.id;
      const avaliacoes = await avaliacaoService.avaliacoesDoEvento(id, criador_id);
      res.json(avaliacoes);
    } catch (error) {
      if (error.message === 'Evento não encontrado') return res.status(404).json({ erro: error.message });
      if (error.message === 'Permissão negada') return res.status(403).json({ erro: error.message });
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar avaliações do evento' });
    }
  }

  async resumo(req, res) {
    try {
      const { id } = req.params;
      const criador_id = req.usuario.id;
      const resumo = await avaliacaoService.resumoAvaliacoes(id, criador_id);
      res.json(resumo);
    } catch (error) {
      if (error.message === 'Evento não encontrado') return res.status(404).json({ erro: error.message });
      if (error.message === 'Permissão negada') return res.status(403).json({ erro: error.message });
      console.error(error);
      res.status(500).json({ erro: 'Erro ao gerar resumo de avaliações' });
    }
  }
  async criarVoluntario(req, res) {
    try {
      const organizador_id = req.usuario.id;
      const avaliacao = await avaliacaoService.criarAvaliacaoVoluntario(organizador_id, req.body);
      res.status(201).json(avaliacao);
    } catch (error) {
      console.error('[criarVoluntario]', error.message, error.stack);
      if (error.message === 'Evento não encontrado') return res.status(404).json({ erro: error.message });
      if (error.message === 'Permissão negada') return res.status(403).json({ erro: error.message });
      res.status(400).json({ erro: error.message || 'Erro ao salvar avaliação do voluntário' });
    }
  }

  async verificarVoluntario(req, res) {
    try {
      const organizador_id = req.usuario.id;
      const { eventoId, voluntarioId } = req.params;
      const avaliacao = await avaliacaoService.verificarAvaliacaoVoluntario(
        organizador_id,
        eventoId,
        voluntarioId
      );
      res.json({ jaAvaliou: !!avaliacao, avaliacao: avaliacao || null });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao verificar avaliação do voluntário' });
    }
  }

  async resumoVoluntario(req, res) {
    try {
      const { voluntarioId } = req.params;
      const resumo = await avaliacaoService.resumoAvaliacaoVoluntario(voluntarioId);
      res.json(resumo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao gerar resumo do voluntário' });
    }
  }
}

module.exports = new AvaliacaoController();
