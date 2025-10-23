import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  options: [], 
};


const dataCenterSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDataCenterOptions(state, action) {
      state.options = action.payload; 
    },
  },
});


export const { setDataCenterOptions } = dataCenterSlice.actions;
export default dataCenterSlice.reducer;
