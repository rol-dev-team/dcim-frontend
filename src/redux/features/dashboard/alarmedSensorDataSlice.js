import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alarmed: [], 
};


const alarmedSensorDataSlice = createSlice({
  name: "alarmedSensorData",
  initialState,
  reducers: {
    setAlarmedSensors(state, action) {
      console.log("Inside reducer: setting alarmed to", action.payload);
      state.alarmed = action.payload.toString(); 
    },
  },
});


export const { setAlarmedSensors } = alarmedSensorDataSlice.actions;
export default alarmedSensorDataSlice.reducer;



