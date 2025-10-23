import { apiClient } from "./api-config/config";

export const fetchThresholdTypes = async () => {
    try {
      const response = await apiClient.get('/threshold-types');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const fetchThresholdType = async (id) => {
    try {
      const response = await apiClient.get(`/threshold-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const createThresholdType = async (thresholdTypeData) => {
    try {
      const response = await apiClient.post('/threshold-types', thresholdTypeData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const updateThresholdType = async (id, thresholdTypeData) => {
    try {
      const response = await apiClient.post(`/threshold-types/${id}?_method=PUT`, thresholdTypeData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteThresholdType = async (id) => {
    try {
      await apiClient.delete(`/threshold-types/${id}`);
    } catch (error) {
      throw error;
    }
  };