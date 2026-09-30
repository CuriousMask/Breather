import api from './api';

export const studioService = {
  getCreations:   ()     => api.get('/creations'),
  saveCreation:   (data) => api.post('/creations', data),
  deleteCreation: (id)   => api.delete(`/creations/${id}`),
};
