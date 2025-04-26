"use client"

import "../../styles/Header.css"
import { useSelector, useDispatch } from "react-redux"
import { clearUserID } from "../../redux/authSlice"

const Header = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const handleLoginClick = () => {
    window.location.href = "/auth"
  }

  const handleLogoutClick = () => {
    dispatch(clearUserID())
    console.log("Logged out, token removed")
    window.location.href = "/"
  }

  const handleProfileClick = () => {
    window.location.href = "/profile"
  }

  return (
    <header>
      <div className="header-left">
        <h1 onClick={() => (window.location.href = "/")} style={{ cursor: "pointer" }}>
          медуслуги
        </h1>
      </div>

      <div className="header-center">
        <input className="search-input" type="text" placeholder="🔍 Поиск" />
      </div>

      <div className="header-right">
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
