import api from './axios';

export const registrationApi = {
  getRegistrationMe: async () => {
    const response = await api.get('/v1/registration/me');
    return response.data;
  },
  
  saveDetails: async (payload) => {
    const response = await api.put('/v1/registration/details', payload);
    return response.data;
  },

  uploadPdf: async (formData, onUploadProgress) => {
    const response = await api.post('/v1/registration/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    });
    return response.data;
  },

  uploadPaper: async (formData) => {
    const response = await api.post('/v1/registration/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  finalSubmit: async () => {
    const response = await api.post('/v1/registration/submit');
    return response.data;
  },

  resubmit: async (payload) => {
    const response = await api.post('/v1/registration/resubmit', payload);
    return response.data;
  }
};
