const eventoService = require('../services/EventoService');

class EventoController {
  async criar(req, res) {
    try {
      const evento = await eventoService.criar(req.usuario, req.body);
      res.status(201).json({ evento });
    } catch (error) {
      this._responderErro(error, res);
    }
  }

  async listar(req, res) {
    try {
      const eventos = await eventoService.listarAtivos();
      res.json({ eventos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async detalhar(req, res) {
    try {
      const evento = await eventoService.detalharAtivo(req.params.id);
      res.json({ evento });
    } catch (error) {
      this._responderErro(error, res);
    }
  }

  async meusEventos(req, res) {
    try {
      const eventos = await eventoService.listarMeusEventos(req.usuario);
      res.json({ eventos });
    } catch (error) {
      this._responderErro(error, res);
    }
  }

  async atualizar(req, res) {
    try {
      const evento = await eventoService.atualizar(req.params.id, req.usuario, req.body);
      res.json({ evento });
    } catch (error) {
      this._responderErro(error, res);
    }
  }

  async cancelar(req, res) {
    try {
      const evento = await eventoService.cancelar(req.params.id, req.usuario);
      res.json({ evento });
    } catch (error) {
      this._responderErro(error, res);
    }
  }

  _responderErro(error, res) {
    if (error.message === 'Apenas organizadores podem executar esta acao') {
      return res.status(403).json({ erro: error.message });
    }

    if (error.message === 'Evento nao encontrado') {
      return res.status(404).json({ erro: error.message });
    }

    if (
      error.message === 'Voce nao tem permissao para alterar este evento' ||
      error.message === 'Evento cancelado nao pode ser editado'
    ) {
      return res.status(403).json({ erro: error.message });
    }

    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = new EventoController();
