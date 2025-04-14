"use client"

import React, { useState } from "react"
import { registerUser, loginUser } from "../../services/api.js"
import { useDispatch } from "react-redux"
import { setUserID } from "../../redux/authSlice"

function RegisterForm() {
  const [state, setState] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passport: "",
    snils: "",
    birthDate: "",
  })

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

    const { firstName, lastName, email, password, passport, snils, birthDate } = state

    try {
      const response = await registerUser({ firstName, lastName, email, password, passport, snils, birthDate })
      console.log("Registration response:", response)

      setSuccessMessage("Регистрация прошла успешно!")

      // After successful registration, login the user
      try {
        const loginResponse = await loginUser({ passport, password })
        console.log("Auto-login response:", loginResponse)

        // Store the JWT token
        if (loginResponse.data) {
          localStorage.setItem("token", loginResponse.data)

          // Set a dummy user ID since we don't have one from the response
          dispatch(setUserID(passport))

          // Redirect to home page
          window.location.href = "/"
        }
      } catch (loginError) {
        console.error("Ошибка автоматического входа:", loginError)
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error)
      setErrorMessage("Ошибка регистрации. Пожалуйста, попробуйте снова.")
    }

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      })
    }
  }

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Регистрация</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <span>используйте ваши данные для регистрации</span>
        <input
          type="text"
          name="firstName"
          value={state.firstName}
          onChange={handleChange}
          placeholder="Имя"
          required
        />
        <input
          type="text"
          name="lastName"
          value={state.lastName}
          onChange={handleChange}
          placeholder="Фамилия"
          required
        />
        <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" required />
        <input
          type="text"
          name="passport"
          value={state.passport}
          onChange={handleChange}
          placeholder="Паспорт"
          required
        />
        <input type="text" name="snils" value={state.snils} onChange={handleChange} placeholder="СНИЛС" required />
        <input
          type="date"
          name="birthDate"
          value={state.birthDate}
          onChange={handleChange}
          placeholder="Дата рождения"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Пароль"
          required
        />
        <button>зарегистрироватся</button>
      </form>
    </div>
  )
}

export default RegisterForm
