import axios from "axios"
import { store } from "../redux/store"
import { setTokens, clearUserID, setRefreshing } from "../redux/authSlice"

const API_BASE_URL = "http://localhost:8080" // Базовый URL сервера

// Create a custom axios instance with detailed logging
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})


// Обработка ответов и обновление токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { dispatch, getState } = store
    const { refreshToken, isRefreshing } = getState().auth

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken &&
      !isRefreshing
    ) {
      originalRequest._retry = true
      dispatch(setRefreshing(true))

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })
        const { accessToken, refreshToken: newRefreshToken } = response.data
        dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }))
        
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        dispatch(clearUserID())
        return Promise.reject(refreshError)
      } finally {
        dispatch(setRefreshing(false))
      }
    }

    return Promise.reject(error)
  }
)

export const refreshTokens = () => {
  const refreshToken = store.getState().auth.refreshToken
  return api.post("/auth/refresh", { refreshToken })
}

export const getDocumentsList = () => {
  return api.get("/api/profile/documents")
}

export const registerUser = (userData) => {
  console.log("Registering user with data:", userData)
  return api.post("/auth/register", {
    passport: userData.passport,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    snils: userData.snils,
    birthDate: userData.birthDate,
  })
}

export const loginUser = (credentials) => {
  console.log("Logging in with credentials:", credentials)
  return api.post("/auth/login", {
    passport: credentials.passport,
    password: credentials.password,
  }).then((response) => {
    const { accessToken, refreshToken } = response.data
    store.dispatch(setTokens({ accessToken, refreshToken }))
    return response})
}

export const getUserInfo = () => {
  return api.get("/secured/user")
}

export const getProfile = () => {
  return api.get("/api/profile/info");
}

export const getMedicalServices = () => {
  console.log("Fetching medical services")
  return api.get("/api/services/main")
}

// Updated to match the actual endpoint
export const getServiceForm = (serviceId) => {
  console.log(`Fetching form for service ID: ${serviceId}`)
  return api.get(`/api/services/${serviceId}/form`)
}

export const submitForm = (formData) => {
  console.log("Submitting form with data:", formData)
  return api.post("/api/services/submit", {
    serviceId: formData.service_id,
    formFields: formData,
  })
}

export const getPdfDocument = (recordId) => {
  console.log(`Fetching PDF for record ID: ${recordId}`)
  return api.get(`/pdf/${recordId}/pdf`, {
    responseType: "blob",
  })
}

// Direct fetch for debugging
export const fetchServicesDirectly = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/main`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Direct fetch services response:", data)
    return data
  } catch (error) {
    console.error("Error in direct fetch:", error)
    throw error
  }
}

export default api
