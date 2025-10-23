import { configureStore } from "@reduxjs/toolkit";
import dataCenterReducer from "../redux/features/dashboard/dataCenterSlice";
import tabListReducer from "../redux/features/dashboard/tabListSlice";
import updatedDataCenterReducer from "../redux/features/dashboard/updatedDataCenterSlice";
import alarmedSensorDataReducer from "../redux/features/dashboard/alarmedSensorDataSlice";
import mqttReducer from "../redux/features/dashboard/mqttSlice";

export const store = configureStore({
  reducer: {
    mqtt: mqttReducer,
    dashboard: dataCenterReducer,
    tablist: tabListReducer,
    updatedDataCenter: updatedDataCenterReducer,
    alarmedSensorData: alarmedSensorDataReducer,
  },
});




