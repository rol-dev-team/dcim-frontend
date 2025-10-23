import { apiClient } from "./api-config/config";

export const fetchDataCentersForMapping = async () => {
  try {
    const response = await apiClient.get("/user-wise/data-centers/mapping");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsersForMapping = async () => {
  try {
    const response = await apiClient.get("/users/mapping");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDcOwnerMappings = async (mappingData) => {
  try {
    const response = await apiClient.post("/dc-owner-mappings", mappingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPartnersForMapping = async () => {
  try {
    const response = await apiClient.get("/partner/mapping");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDcPartnerMappings = async (mappingData) => {
  try {
    const response = await apiClient.post("/dc-partner-mappings", mappingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
