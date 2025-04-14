import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userID: null,
  token: localStorage.getItem("token") || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
    },
    clearUserID: (state) => {
      state.userID = null
      state.token = null
      localStorage.removeItem("token")
    },
  },
})

export const { setUserID, setToken, clearUserID } = authSlice.actions
export default authSlice.reducer
