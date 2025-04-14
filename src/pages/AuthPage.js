"use client"

import { useState, useEffect } from "react"
import "../styles/Auth.css"
import LoginForm from "../components/forms/LoginForm"
import RegisterForm from "../components/forms/RegisterForm"

export default function Auth() {
  const [type, setType] = useState("signIn")

  useEffect(() => {
    // If user is already authenticated, redirect to home page
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "/"
    }
  }, [])

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text)
      return
    }
  }

  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "")

  return (
    <div className="Auth">
      <div className={containerClass} id="container">
        <RegisterForm />
        <LoginForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>С Возвращением!</h1>
              <p>Чтобы оставаться на связи, пожалуйста, войдите в систему, указав свои личные данные</p>
              <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                войти
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Привет!</h1>
              <p>Введите свои личные данные и начните пользоваться приложением</p>
              <button className="ghost " id="signUp" onClick={() => handleOnClick("signUp")}>
                зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
