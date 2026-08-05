import api from './axios';

export const teamManagementApi = {
  removeMember: async (teamId, targetUserId) => {
    const response = await api.post(`/v1/team-management/${teamId}/remove-member`, { targetUserId });
    return response.data;
  },
  leaveTeam: async (teamId) => {
    const response = await api.post(`/v1/team-management/${teamId}/leave`);
    return response.data;
  },
  transferLeadership: async (teamId, targetUserId) => {
    const response = await api.post(`/v1/team-management/${teamId}/transfer-leadership`, { targetUserId });
    return response.data;
  },
  getTimeline: async (teamId) => {
    const response = await api.get(`/v1/team-management/${teamId}/timeline`);
    return response.data;
  }
};
