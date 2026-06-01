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

export default api;

