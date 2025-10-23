import { apiClient } from "./api-config/config";

export const fetchDevices = async () => {
  try {
    const response = await apiClient.get('/devices');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDevice = async (id) => {
  try {
    const response = await apiClient.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDevice = async (deviceData) => {
  try {
    const response = await apiClient.post('/devices', deviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDevice = async (id, deviceData) => {
  try {
    const response = await apiClient.put(`/devices/${id}`, deviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDevice = async (id) => {
  try {
    await apiClient.delete(`/devices/${id}`);
  } catch (error) {
    throw error;
  }
};


export const fetchDevicesByDataCenter = async (dataCenterId) => {
  try {
    const response = await apiClient.get(`/devices/by-data-center/${dataCenterId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const fetchDataCenters = async () => {
//   try {
//     const response = await apiClient.get('/devices/data-centers');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };