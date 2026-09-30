import api from './api';

export const preferenceService = {
  getPreferences:  ()     => api.get('/preferences'),
  savePreferences: (data) => api.post('/preferences', data),
};
