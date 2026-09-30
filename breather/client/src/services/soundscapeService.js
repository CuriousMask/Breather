import api from './api';

export const soundscapeService = {
  getSoundscapes:   ()        => api.get('/soundscapes'),
  saveSoundscape:   (data)    => api.post('/soundscapes', data),
  updateSoundscape: (id, data)=> api.put(`/soundscapes/${id}`, data),
  deleteSoundscape: (id)      => api.delete(`/soundscapes/${id}`),
};
