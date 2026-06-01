const inscricaoService = require('../services/InscricaoService');

class InscricaoController {
  async inscrever(req, res) {
    try {
      const { evento_id } = req.body;
      const usuario_id = req.usuario.id;

      if (!evento_id) {
        return res.status(400).json({ erro: 'evento_id é obrigatório' });
      }

      const inscricao = await inscricaoService.inscreverEmEvento(usuario_id, evento_id);
      res.status(201).json(inscricao);
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async minhasInscricoes(req, res) {
    try {
      const usuario_id = req.usuario.id;
      const inscricoes = await inscricaoService.listarInscricoesDoUsuario(usuario_id);
      res.json(inscricoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar inscrições' });
    }
  }

  async inscricoesDoEvento(req, res) {
    try {
      const { evento_id } = req.params;
      const criador_id = req.usuario.id;

      const inscricoes = await inscricaoService.listarInscricoesDoEvento(evento_id, criador_id);
      res.json(inscricoes);
    } catch (error) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar inscrições do evento' });
    }
  }

  async aprovar(req, res) {
    try {
      const { id } = req.params;
      const criador_id = req.usuario.id;

      const inscricao = await inscricaoService.aprovarInscricao(id, criador_id);
      res.json(inscricao);
    } catch (error) {
      if (error.message === 'Inscrição não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async recusar(req, res) {
    try {
      const { id } = req.params;
      const criador_id = req.usuario.id;

      const inscricao = await inscricaoService.recusarInscricao(id, criador_id);
      res.json(inscricao);
    } catch (error) {
      if (error.message === 'Inscrição não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async registrarPresenca(req, res) {
    try {
      const { id } = req.params;
      const { presente } = req.body;
      const criador_id = req.usuario.id;

      const inscricao = await inscricaoService.registrarPresenca(id, criador_id, presente);
      res.json(inscricao);
    } catch (error) {
      if (error.message === 'Inscrição não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      await inscricaoService.cancelarInscricao(id, usuario_id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Inscrição não encontrada') {
        return res.status(404).json({ erro: error.message });
      }
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new InscricaoController();
