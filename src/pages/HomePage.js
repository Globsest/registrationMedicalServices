"use client"

import { useState, useEffect } from "react"
import Header from "../components/shared/Header"
import Footer from "../components/shared/Footer"
import ServiceGrid from "../components/forms/ServiceGrid"
import DynamicForm from "../components/forms/DynamicForm"
import "../styles/HomePage.css"
import { getMedicalServices, fetchServicesDirectly } from "../services/api.js"
import { useSelector } from "react-redux"

const HomePage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const token = localStorage.getItem("token")
  const userID = useSelector((state) => state.auth.userID)
  const isAuthenticated = !!token

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError(null)

      try {
        // Try with axios first
        const response = await getMedicalServices()
        console.log("Services response with axios:", response)

        if (response.data) {
          console.log("Raw services data:", response.data)

          // Check if we have any services
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Transform the data to match the expected format
            const transformedServices = response.data.map((service) => {
              // Log the raw service to debug field structure
              console.log("Raw service data:", service)

              return {
                ...service,
                id: service.serviceId || service.id,
                serviceId: service.serviceId || service.id,
                name: service.name || service.serviceName || "Медицинская услуга",
                description: service.description || "",
              }
            })

            console.log("Transformed services:", transformedServices)
            setServices(transformedServices)
          } else {
            // If no services were returned, show an error
            setError("Нет доступных услуг в базе данных.")
          }
        } else {
          throw new Error("No data returned from services API")
        }
      } catch (axiosError) {
        console.error("Error fetching services with axios:", axiosError)

        // Try with direct fetch as a fallback
        try {
          console.log("Trying direct fetch as fallback")
          const directData = await fetchServicesDirectly()

          if (directData && Array.isArray(directData) && directData.length > 0) {
            console.log("Direct fetch successful:", directData)

            const transformedServices = directData.map((service) => ({
              ...service,
              id: service.serviceId || service.id,
              serviceId: service.serviceId || service.id,
              name: service.name || service.serviceName || "Медицинская услуга",
              description: service.description || "",
            }))

            setServices(transformedServices)
          } else {
            setError("Нет доступных услуг в базе данных.")
          }
        } catch (fetchError) {
          console.error("Error with direct fetch:", fetchError)
          setError("Не удалось загрузить услуги с сервера. Пожалуйста, попробуйте позже.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Обработчик выбора услуги
  const handleServiceSelect = (service) => {
    if (!isAuthenticated) {
      window.location.href = "/auth"
      return
    }

    setSelectedService(service)
  }

  // Закрытие формы
  const handleCloseForm = () => {
    setSelectedService(null)
  }

  return (
    <div className="home-page">
      <Header />
      <main>
        <div className="homePage">
          <h1>Доступные медицинские услуги</h1>

          {loading ? (
            <div className="loading">Загрузка услуг...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <ServiceGrid services={services} onSelect={handleServiceSelect} isAuthenticated={isAuthenticated} />
          )}

          {selectedService && isAuthenticated && <DynamicForm service={selectedService} onClose={handleCloseForm} />}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
