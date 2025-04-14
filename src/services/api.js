import axios from "axios"

const API_BASE_URL = "http://localhost:8080" // Базовый URL сервера

// Create a custom axios instance with detailed logging
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    })

    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response
        ? {
            url: error.config.url,
            status: error.response.status,
            data: error.response.data,
          }
        : error,
    )
    return Promise.reject(error)
  },
)

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
  })
}

export const getUserInfo = () => {
  return api.get("/secured/user")
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
