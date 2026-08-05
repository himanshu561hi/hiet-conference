import { useState } from 'react';
import api from '../api/axios';

export const useUpload = (uploadUrl) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, fieldName = 'paper') => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await api.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setIsUploading(false);
      return response.data;
    } catch (err) {
      setIsUploading(false);
      setProgress(0);
      setError(err);
      throw err;
    }
  };

  return { uploadFile, progress, isUploading, error };
};
