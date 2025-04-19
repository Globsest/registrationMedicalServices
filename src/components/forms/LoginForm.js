"use client"

import React, { useState } from "react"
import { loginUser } from "../../services/api.js"
import { useDispatch } from "react-redux"
import { setUserID, setTokens } from "../../redux/authSlice"

function LoginForm() {
  const [state, setState] = React.useState({
    passport: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const dispatch = useDispatch()

  const handleChange = (evt) => {
    const value = evt.target.value
    setState({
      ...state,
      [evt.target.name]: value,
    })
  }

  const handleOnSubmit = async (evt) => {
    evt.preventDefault()
    setLoading(true)
    setError(null)

    const { passport, password } = state

    try {
      console.log("Attempting login with:", { passport, password })
      const response = await loginUser({ passport, password })
      console.log("Login response:", response)

      // Store the JWT token
      //if (response.data) {
      if (response.data?.accessToken && response.data?.refreshToken) {
        console.log("Token received:", response.data)
        //localStorage.setItem("token", response.data)

        dispatch(setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }))

        // Set a dummy user ID since we don't have one from the response
        //dispatch(setUserID(passport))

        setError(null)
        setSuccessMessage("Вход выполнен успешно!")

        // Redirect to home page
        window.location.href = "/"
      } else {
        throw new Error("No token received from server")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error.response?.data?.message || "Ошибка авторизации. Пожалуйста, проверьте данные.")
      // Error is already set in the setError call above
    } finally {
      setLoading(false)

      // Clear form
      setState({
        passport: "",
        password: "",
      })
    }
  }

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Вход</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Паспорт"
          name="passport"
          value={state.passport}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={state.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Вход..." : "войти"}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
