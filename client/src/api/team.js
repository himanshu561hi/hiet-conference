import api from './axios';

export const teamApi = {
  createTeam: async (teamData) => {
    // Uses the API versioning format enforced by the backend
    const response = await api.post('/v1/team/create', teamData);
    return response.data; // Return the standardized response wrapper
  },
  getMyTeam: async () => {
    const response = await api.get('/v1/team/me');
    return response.data;
  }
};
