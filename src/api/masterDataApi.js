import { apiClient } from "./api-config/config";

export const fetchUserTypes = async () => {
  try {
    const response = await apiClient.get("/master-data/user-types");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserRoles = async () => {
  try {
    const response = await apiClient.get("/master-data/user-roles");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await apiClient.get("/master-data/user-department");
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const fetchDivisions = async () => {
  try {
    const response = await apiClient.get("/master-data/divisions");
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchOwnerTypes = async () => {
  try {
    const response = await apiClient.get("/master-data/owner-type");
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const fetchPartners = async () => {
  try {
    const response = await apiClient.get("/master-data/partner-lists");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPartner = async (id) => {
  try {
    const response = await apiClient.get(`/master-data/partner-lists/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPartner = async (partnerData) => {
  try {
    const response = await apiClient.post("/master-data/partner-lists", partnerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePartner = async (id, partnerData) => {
  try {
    const response = await apiClient.put(`/master-data/partner-lists/${id}`, partnerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePartner = async (id) => {
  try {
    await apiClient.delete(`/master-data/partner-lists/${id}`);
  } catch (error) {
    throw error;
  }
};