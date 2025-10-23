import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataCenter: null, 
};


const updatedDataCenterSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUpdatedDataCenter(state, action) {
      state.dataCenter = action.payload; 
    },
  },
});


export const { setUpdatedDataCenter } = updatedDataCenterSlice.actions;
export default updatedDataCenterSlice.reducer;
