import { createSlice } from "@reduxjs/toolkit";

const mqttSlice = createSlice({
  name: "mqtt",
  initialState: {
    data: [],
  },
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
  },
});

export const { addData, clearData } = mqttSlice.actions;
export default mqttSlice.reducer;
