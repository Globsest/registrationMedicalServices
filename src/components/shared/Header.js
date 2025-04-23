"use client"

import "../../styles/Header.css"
import { useSelector, useDispatch } from "react-redux"
import { clearUserID } from "../../redux/authSlice"

const Header = () => {
  const dispatch = useDispatch()
  //const userID = useSelector((state) => state.auth.userID)
  //const token = localStorage.getItem("token")

  const { token, refreshToken } = useSelector((state) => state.auth)

  const handleLoginClick = () => {
    window.location.href = "/auth"
  }

  const handleLogoutClick = () => {
    // Clear token and user ID
    //localStorage.removeItem("token")
    dispatch(clearUserID())

    console.log("Logged out, token removed")

    // Redirect to home page
    window.location.href = "/"
  }

  const handleProfileClick = () => {
    window.location.href = "/profile"
  }

  return (
    <header>
      <h1 onClick={() => (window.location.href = "/")} style={{ cursor: "pointer" }}>
        медуслуги
      </h1>
      <div>
      {token && (
          <button className="profile-button" onClick={handleProfileClick}>
            Личный кабинет
          </button>
        )}
        {token ? (
          <button className="loginbutton" onClick={handleLogoutClick}>
            Выйти
          </button>
        ) : (
          <button className="loginbutton" onClick={handleLoginClick}>
            Авторизация
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
