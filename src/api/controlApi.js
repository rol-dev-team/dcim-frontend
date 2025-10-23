import { apiClient } from "./api-config/config";

export const sensorControl = async (data) => {
  try {
    const response = await apiClient.post("/sensor-control", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getScheduleFrequency = async () => {
  try {
    const response = await apiClient.get("/operation-repeat");

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDaysOfWeek = async () => {
  try {
    const response = await apiClient.get("/operation-schedulling");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeDOSensorConfiguration = async (data) => {
  try {
    const response = await apiClient.post(
      "/store-control-configurations",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
