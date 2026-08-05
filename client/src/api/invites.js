import api from './axios';

export const invitesApi = {
  sendInvite: async (inviteData) => {
    const response = await api.post('/v1/invites/send', inviteData);
    return response.data;
  },
  acceptInvite: async (inviteId) => {
    const response = await api.post(`/v1/invites/${inviteId}/accept`);
    return response.data;
  },
  rejectInvite: async (inviteId) => {
    const response = await api.post(`/v1/invites/${inviteId}/reject`);
    return response.data;
  },
  cancelInvite: async (inviteId) => {
    const response = await api.post(`/v1/invites/${inviteId}/cancel`);
    return response.data;
  },
  getMyInvites: async () => {
    const response = await api.get('/v1/invites/me');
    return response.data;
  },
  getTeamInvites: async () => {
    const response = await api.get('/v1/invites/team');
    return response.data;
  }
};
