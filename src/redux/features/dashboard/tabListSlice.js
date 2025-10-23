import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [],
};

const tabListSlice = createSlice({
  name: "tablist",
  initialState,
  reducers: {
    setTabList(state, action) {
      state.tabs = action.payload;
    },
  },
});

export const { setTabList } = tabListSlice.actions;
export default tabListSlice.reducer;
