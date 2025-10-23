import { apiClient } from "../api-config/config";


export const fetchAllDivisions = async () => {
  try {
    const response = await apiClient.get("settings/divisions");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDivision = async (data) => {
  try {
    const response = await apiClient.post("settings/divisions", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchDivision = async (id) => {
  try {
    const response = await apiClient.get(`settings/divisions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateDivision = async (id, data) => {
  try {
    const response = await apiClient.put(`settings/divisions/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteDivision = async (id) => {
  try {
    const response = await apiClient.delete(`settings/divisions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
