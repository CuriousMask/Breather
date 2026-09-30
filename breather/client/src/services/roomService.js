import api from './api';

export const roomService = {
  getRoom:   ()     => api.get('/rooms'),
  saveRoom:  (data) => api.post('/rooms', data),
  updateRoom:(data) => api.put('/rooms', data),
};
