"use client"

import "../styles/ProfilePage.css"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getProfile } from "../services/api"
import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import DocumentsList from "../components/forms/DocumentList"

export default function ProfilePage() {
  const { token } = useSelector((state) => state.auth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (!token) {
      window.location.href = "/auth"
      return
    }

    const loadProfile = async () => {
      try {
        const response = await getProfile()
        setProfile(response.data)
      } catch (err) {
        console.error("Profile load error:", err)
        setError(err.response?.data?.message || err.message || "Ошибка загрузки профиля")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token])

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают!")
      return
    }

    // Здесь вызов API для сохранения пароля (псевдокод)
    console.log("Saving new password:", newPassword)
    alert("Пароль успешно изменён!")

    // Очистить поля и вернуть кнопку назад
    setNewPassword("")
    setConfirmPassword("")
    setIsChangingPassword(false)
  }

  if (!token) {
    return null
  }

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-main">
        <h1 className="profile-title">Личный кабинет</h1>
        <div className="cards-wrapper">
          {/* Блок профиля */}
          <div className="profile-card">
            <h2 className="card-title">Ваши данные</h2>
            {loading ? (
              <div className="loading">Загрузка данных...</div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="retry-button"
                >
                  Попробовать снова
                </button>
              </div>
            ) : profile ? (
              <div className="profile-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Фамилия:</span>
                    <span className="info-value">{profile.lastName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{profile.firstName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Паспорт:</span>
                    <span className="info-value">{profile.passport}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">СНИЛС:</span>
                    <span className="info-value">{profile.snils}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Дата рождения:</span>
                    <span className="info-value">
                      {new Date(profile.birthDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <div className="change-password-section">
                  {!isChangingPassword ? (
                    <button 
                      className="change-password-button" 
                      onClick={() => setIsChangingPassword(true)}
                    >
                      Сменить пароль
                    </button>
                  ) : (
                    <div className="password-form">
                      <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                      />
                      <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="password-input"
                      />
                      <button 
                        className="save-password-button"
                        onClick={handleSavePassword}
                      >
                        Сохранить пароль
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="error-message">Данные профиля не найдены</div>
            )}
          </div>

          {/* Блок документов */}
          <div className="profile-card">
            <h2 className="card-title">Ваши документы</h2>
            <DocumentsList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}