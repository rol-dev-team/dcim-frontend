import { apiClient } from "./api-config/config";

export const fetchSensorLists = async () => {
  try {
    const response = await apiClient.get('/sensor-lists');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSensorList = async (id) => {
  try {
    const response = await apiClient.get(`/sensor-lists/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSensorList = async (sensorListData) => {
  try {
    const response = await apiClient.post('/sensor-lists', sensorListData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSensorList = async (id, sensorListData) => {
  try {
    const response = await apiClient.put(`/sensor-lists/${id}`, sensorListData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSensorList = async (id) => {
  try {
    await apiClient.delete(`/sensor-lists/${id}`);
  } catch (error) {
    throw error;
  }
};


export const fetchSensorTypeLists = async () => {
    try {
      const response = await apiClient.get('/sensor-type-lists');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const fetchTriggerTypeLists = async () => {
    try {
      const response = await apiClient.get('/trigger-type-lists');
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const fetchSensorsByDevice = async (deviceId) => {
    try {
      const response = await apiClient.get(`/sensor-lists/by-device/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  // export const fetchSensorTypeLists = async () => {
  //   try {
  //     const response = await apiClient.get('/sensor-type-lists');
  //     return response.data.data; // Note the extra .data to match your response structure
  //   } catch (error) {
  //     throw error;
  //   }
  // };


  export const fetchSensorRealTimeValueByDataCenter = async (dataCenterId) => {
    try {
      const response = await apiClient.get(
        `/sensor-real-time/${dataCenterId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };