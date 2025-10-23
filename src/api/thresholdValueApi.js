import { apiClient } from "./api-config/config";

export const fetchThresholdValues = async () => {
  try {
    const response = await apiClient.get('/threshold-values');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchThresholdValue = async (id) => {
  try {
    const response = await apiClient.get(`/threshold-values/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createThresholdValue = async (thresholdValueData) => {
  try {
    const response = await apiClient.post('/threshold-values', thresholdValueData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateThresholdValue = async (id, thresholdValueData) => {
  try {
    const response = await apiClient.put(`/threshold-values/${id}`, thresholdValueData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteThresholdValue = async (id) => {
  try {
    await apiClient.delete(`/threshold-values/${id}`);
  } catch (error) {
    throw error;
  }
};