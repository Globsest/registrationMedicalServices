"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getProfile } from "../services/api";
import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import DocumentsList from "../components/forms/DocumentList";

export default function ProfilePage() {
  const { token } = useSelector((state) => state.auth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (!token) {
    return null
  }

  return (
    <div className="home-page">
      <Header />
      <main>
        <div className="homePage">
          <h1>Личный кабинет</h1>
          
          {loading ? (
            <div className="loading">Загрузка данных...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Попробовать снова
              </button>
            </div>
          ) : profile ? (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Фамилия:</span>
                <span className="info-value">{profile.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Имя:</span>
                <span className="info-value">{profile.firstName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Паспорт:</span>
                <span className="info-value">{profile.passport}</span>
              </div>
              <div className="info-row">
                <span className="info-label">СНИЛС:</span>
                <span className="info-value">{profile.snils}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Дата рождения:</span>
                <span className="info-value">
                  {new Date(profile.birthDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
            
          ) : (
            <div className="error-message">Данные профиля не найдены</div>
          )}
          <DocumentsList />
        </div>
      </main>
      <Footer />
    </div>
  )
}