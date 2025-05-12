"use client"

import { useState, useEffect } from "react"
import "../../styles/HomePage.css"
import { submitForm, getPdfDocument, getServiceForm, getProfile } from "../../services/api.js"
import { useSelector } from "react-redux"
import PdfViewer from "../pdf/PdfViewer"

const DynamicForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfData, setPdfData] = useState(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [recordId, setRecordId] = useState(null) // Новый state
  const [fields, setFields] = useState([])
  const [loadingFields, setLoadingFields] = useState(true)
  const [loadingUserData, setLoadingUserData] = useState(true)
  const userID = useSelector((state) => state.auth.userID)
  const [successMessage, setSuccessMessage] = useState(null)

  const userFields = [
    "Фамилия",
    "Имя", 
    "Паспорт",
    "Снилс",
    "Почта",
    "Дата рождения" 
  ]
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  useEffect(() => {
    const fetchFields = async () => {
      setLoadingFields(true)
      setError(null)

      try {
        const userResponse = await getProfile()
        const userData = userResponse.data

        const formattedBirthDate = formatDate(userData.birthDate)
        const initialFormData = {
          "Фамилия": userData.lastName || "",
          "Имя": userData.firstName || "",
          "Паспорт": userData.passport || "",
          "Снилс": userData.snils || "",
          "Почта": userData.email || "",
          "Дата рождения": formattedBirthDate
        }
        
        setFormData(initialFormData)
        setLoadingUserData(false)

        const serviceId = service.serviceId || service.id

        if (!serviceId) {
          throw new Error("Service ID is required to fetch fields")
        }

        const response = await getServiceForm(serviceId)

        if (response.data && response.data.formStruct) {
          let formFields = []

          if (typeof response.data.formStruct === "string") {
            try {
              formFields = JSON.parse(response.data.formStruct)
            } catch (e) {
              console.error("Error parsing formStruct:", e)
              throw new Error("Invalid form structure format")
            }
          } else if (Array.isArray(response.data.formStruct)) {
            formFields = response.data.formStruct
          }

          const allFields = [...userFields, ...formFields]

          if (allFields.length > 0) {
            setFields(allFields)
          } else {
            throw new Error("No fields found in form structure")
          }
        } else {
          throw new Error("No form structure returned from API")
        }
      } catch (error) {
        console.error("Error loading fields:", error)
        setError("Не удалось загрузить поля формы для данной услуги.")
      } finally {
        setLoadingFields(false)
      }
    }

    fetchFields()
  }, [service])

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const payload = {
      serviceId: service.serviceId || service.id,
      formFields: {
        userFields: {},
        serviceFields: {}
      }
    }

    const userFieldsList = ["Фамилия", "Имя", "Паспорт", "Снилс", "Почта", "Дата рождения"]
    userFieldsList.forEach(field => {
      payload.formFields.userFields[field] = formData[field] || ""
    })

    Object.keys(formData).forEach(key => {
      if (!userFieldsList.includes(key)) {
        payload.formFields.serviceFields[key] = formData[key]
      }
    })

    try {
      const response = await submitForm(payload)
      setSuccessMessage("Форма успешно отправлена!")

      if (response.data) {
        setRecordId(response.data) // сохраняем recordId
        const pdfResponse = await getPdfDocument(response.data)
        setPdfData(pdfResponse.data)
        setShowPdfViewer(true)
      } else {
        onClose()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setError(error.response?.data?.message || "Ошибка отправки формы. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  const handleClosePdfViewer = () => {
    setShowPdfViewer(false)
    setPdfData(null)
    onClose()
  }

  if (showPdfViewer && pdfData && recordId) {
    return <PdfViewer pdfData={pdfData} onClose={handleClosePdfViewer} recordId={recordId} />
  }

  if (loadingFields) {
    return (
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>{service.name || service.description || "Медицинская услуга"}</h2>
          <div className="loading">Загрузка полей формы...</div>
        </div>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>{service.name || service.description || "Медицинская услуга"}</h2>
          <div className="error-message">Для данной услуги не определены поля формы.</div>
          <div className="formActions">
            <button type="button" onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>{service.name || service.description || "Медицинская услуга"}</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form className="formmod" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field} className="formField">
              <label>{field}:</label>
              <input
                type="text"
                value={formData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
                disabled={loading}
              />
            </div>
          ))}
          <div className="formActions">
            <button type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Отправить"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DynamicForm
