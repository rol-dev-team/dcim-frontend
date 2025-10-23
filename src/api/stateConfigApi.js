import { apiClient } from "./api-config/config";

export const fetchStateConfigs = async () => {
  try {
    const response = await apiClient.get('/state-configs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStateConfig = async (id) => {
  try {
    const response = await apiClient.get(`/state-configs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createStateConfig = async (data) => {
  try {
    const response = await apiClient.post('/state-configs', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStateConfig = async (id, data) => {
  try {
    const response = await apiClient.put(`/state-configs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStateConfig = async (id) => {
  try {
    await apiClient.delete(`/state-configs/${id}`);
  } catch (error) {
    throw error;
  }
};