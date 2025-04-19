import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userID: null,
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isRefreshing: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserID: (state, action) => {
      state.userID = action.payload
    },
    setTokens: (state, action) => {
      state.token = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem("token", action.payload.accessToken)
      localStorage.setItem("refreshToken", action.payload.refreshToken)
    },
    clearUserID: (state) => {
      state.userID = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload
    },
  },
})

export const { setUserID, setTokens, clearUserID, setRefreshing } = authSlice.actions
export default authSlice.reducer
