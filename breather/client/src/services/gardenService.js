import api from './api';

export const gardenService = {
  getGarden:         ()       => api.get('/garden'),
  saveGarden:        (data)   => api.post('/garden', data),
  updateGarden:      (data)   => api.put('/garden', data),
  deleteGardenObject:(objectId) => api.delete('/garden/object', { data: { objectId } }),
};
