import api from './axios';

export const requestsApi = {
  sendRequest: async (requestData) => {
    const response = await api.post('/v1/requests/send', requestData);
    return response.data;
  },
  acceptRequest: async (requestId) => {
    const response = await api.post(`/v1/requests/${requestId}/accept`);
    return response.data;
  },
  rejectRequest: async (requestId) => {
    const response = await api.post(`/v1/requests/${requestId}/reject`);
    return response.data;
  },
  cancelRequest: async (requestId) => {
    const response = await api.post(`/v1/requests/${requestId}/cancel`);
    return response.data;
  },
  getTeamRequests: async () => {
    const response = await api.get('/v1/requests/team');
    return response.data;
  },
  getUserRequests: async () => {
    const response = await api.get('/v1/requests/me');
    return response.data;
  }
};
