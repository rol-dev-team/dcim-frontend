import { apiClient } from "./api-config/config";

export const fetchOperationMode = async () => {
  try {
    const response = await apiClient.get("/operation-modes");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchControllableSensors = async (data) => {
  try {
    const response = await apiClient.post("/controllable-sensors", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const storeControlConfigurations = async (data) => {
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
