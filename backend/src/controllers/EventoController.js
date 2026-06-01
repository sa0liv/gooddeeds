const eventoService = require('../services/EventoService');

class EventoController {
  async criar(req, res) {
    try {
      const { titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades } = req.body;
      const evento = await eventoService.criarEvento(
        { titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades },
        req.usuario.id
      );
      res.status(201).json(evento);
    } catch (error) {
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async obter(req, res) {
    try {
      const { id } = req.params;
      const evento = await eventoService.obterEvento(id);
      res.json(evento);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  async listar(req, res) {
    try {
      const { categoria, cidade } = req.query;
      let eventos;

      if (categoria) {
        eventos = await eventoService.listarEventosPorCategoria(categoria);
      } else if (cidade) {
        eventos = await eventoService.listarEventosPorCidade(cidade);
      } else {
        eventos = await eventoService.listarEventos();
      }

      res.json(eventos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar eventos' });
    }
  }

  async listarMeus(req, res) {
    try {
      const eventos = await eventoService.listarEventosDoUsuario(req.usuario.id);
      res.json(eventos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao listar seus eventos' });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades } = req.body;
      const evento = await eventoService.atualizarEvento(
        id,
        { titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades },
        req.usuario.id
      );
      res.json(evento);
    } catch (error) {
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await eventoService.deletarEvento(id, req.usuario.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Permissão negada') {
        return res.status(403).json({ erro: error.message });
      }
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }
      console.error(error);
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new EventoController();
