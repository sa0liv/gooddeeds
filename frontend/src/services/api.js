import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const cadastrar = (dados) => api.post('/auth/registrar', dados);
export const login = (dados) => api.post('/auth/login', dados);
export const atualizarPerfil = (dados) => api.put('/auth/perfil', dados);

// Eventos
export const criarEvento = (dados) => api.post('/eventos', dados);
export const listarEventos = (filtros) => api.get('/eventos', { params: filtros });
export const obterEvento = (id) => api.get(`/eventos/${id}`);
export const atualizarEvento = (id, dados) => api.put(`/eventos/${id}`, dados);
export const encerrarEvento = (id) => api.put(`/eventos/${id}/encerrar`, {});
export const deletarEvento = (id) => api.delete(`/eventos/${id}`);
export const listarMeusEventos = () => api.get('/eventos/meus');

// Inscrições
export const inscreverEvento = (eventoId) => api.post('/inscricoes', { evento_id: eventoId });
export const minhasInscricoes = () => api.get('/inscricoes');
export const inscricoesDoEvento = (eventoId) => api.get(`/inscricoes/evento/${eventoId}`);
export const aprovarInscricao = (inscricaoId) => api.put(`/inscricoes/${inscricaoId}/aprovar`, {});
export const recusarInscricao = (inscricaoId) => api.put(`/inscricoes/${inscricaoId}/recusar`, {});
export const cancelarInscricao = (inscricaoId) => api.delete(`/inscricoes/${inscricaoId}`);
export const registrarPresenca = (inscricaoId, presente) => api.put(`/inscricoes/${inscricaoId}/presenca`, { presente });
export const historicoParticipacoes = () => api.get('/inscricoes/historico');

// Avaliações
export const criarAvaliacao = (dados) => api.post('/avaliacoes', dados);
export const criarAvaliacaoVoluntario = (dados) => api.post('/avaliacoes/voluntario', dados);
export const minhasAvaliacoes = () => api.get('/avaliacoes/minhas');
export const verificarAvaliacao = (eventoId) => api.get(`/avaliacoes/verificar/${eventoId}`);
export const verificarAvaliacaoVoluntario = (eventoId, voluntarioId) => api.get(`/avaliacoes/voluntario/verificar/${eventoId}/${voluntarioId}`);
export const resumoAvaliacaoVoluntario = (voluntarioId) => api.get(`/avaliacoes/voluntario/resumo/${voluntarioId}`);
export const avaliacoesDoEvento = (eventoId) => api.get(`/eventos/${eventoId}/avaliacoes`);
export const resumoAvaliacoes = (eventoId) => api.get(`/eventos/${eventoId}/avaliacoes/resumo`);

export default api;

