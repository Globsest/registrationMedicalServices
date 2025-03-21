import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userID: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload;
    },
    clearUserID: (state) => {
      state.userID = null;
    },
  },
});

export const { setUserID, clearUserID } = authSlice.actions;
export default authSlice.reducer;