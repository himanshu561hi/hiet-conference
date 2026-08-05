import api from './axios';

export const adminApi = {
  fetchMetrics: async () => {
    const response = await api.get('/v1/admin/metrics');
    return response.data;
  },
  
  fetchQueue: async (params) => {
    const response = await api.get('/v1/admin/queue', { params });
    return response.data;
  },
  
  fetchRegistrationDetails: async (id) => {
    const response = await api.get(`/v1/admin/registration/${id}`);
    return response.data;
  },

  approveRegistration: async (registrationId) => {
    const response = await api.post('/v1/admin/review/approve', { registrationId });
    return response.data;
  },

  rejectRegistration: async (registrationId, reason) => {
    const response = await api.post('/v1/admin/review/reject', { registrationId, reason });
    return response.data;
  },

  requestCorrection: async (registrationId, correctionItems, internalNotes) => {
    const response = await api.post('/v1/admin/review/needs-correction', { registrationId, correctionItems, internalNotes });
    return response.data;
  },

  fetchReviewHistory: async (registrationId) => {
    const response = await api.get(`/v1/admin/review/history/${registrationId}`);
    return response.data;
  },

  fetchDashboardSummary: async () => {
    const response = await api.get('/v1/admin/dashboard/summary');
    return response.data;
  },

  fetchSettings: async () => {
    const response = await api.get('/v1/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/v1/admin/settings', settings);
    return response.data;
  },

  bulkApprove: async (registrationIds) => {
    const response = await api.post('/v1/admin/bulk/approve', { registrationIds });
    return response.data;
  },

  bulkExport: async (filter, format) => {
    // We expect a blob response to trigger a download
    const response = await api.post('/v1/admin/bulk/export', { filter, format }, {
      responseType: 'blob'
    });
    return response.data;
  },

  updateStatus: async (id, status, rejectionReason = '') => {
    const response = await api.post(`/v1/admin/registration/${id}/status`, { status, rejectionReason });
    return response.data;
  }
};
