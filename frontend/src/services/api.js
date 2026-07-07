import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gra_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const unwrap = (promise) => promise.then((res) => res.data.data);

export const RepositoryAPI = {
  search: (q, page = 1, perPage = 12) =>
    unwrap(api.get('/repositories/search', { params: { q, page, per_page: perPage } })),
  overview: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}`)),
  languages: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/languages`)),
  contributors: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/contributors`)),
  commits: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/commits`)),
  issues: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/issues`)),
  pulls: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/pulls`)),
  releases: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/releases`)),
  activity: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/activity`)),
  health: (owner, repo) => unwrap(api.get(`/repositories/${owner}/${repo}/health`)),
  reportUrl: (owner, repo, format) =>
    `${API_URL}/repositories/${owner}/${repo}/report?format=${format}`,
};

export const BookmarkAPI = {
  list: () => unwrap(api.get('/bookmarks')),
  create: (owner, repo) => api.post('/bookmarks', { owner, repo }),
  remove: (id) => api.delete(`/bookmarks/${id}`),
};

export const AuthAPI = {
  me: () => unwrap(api.get('/auth/me')),
  loginUrl: `${API_URL}/auth/github`,
};

export default api;
