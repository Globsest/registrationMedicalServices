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
  const [fields, setFields] = useState([])
  const [loadingFields, setLoadingFields] = useState(true)
  const [loadingUserData, setLoadingUserData] = useState(true)
  const userID = useSelector((state) => state.auth.userID)
  const [successMessage, setSuccessMessage] = useState(null)

  //const currentDate = new Date()
  //const formattedDate = currentDate.toLocaleString()

  console.log("Service in DynamicForm:", service)

  // Захардкоженные пользовательские поля
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


  // Load fields when component mounts
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

        // Fetch the form structure from the API
        const response = await getServiceForm(serviceId)
        console.log("Form structure response:", response.data)

        // Extract fields from the formStruct property
        if (response.data && response.data.formStruct) {
          let formFields = []

          // Handle different formats of formStruct
          if (typeof response.data.formStruct === "string") {
            try {
              // Try to parse as JSON if it's a string
              formFields = JSON.parse(response.data.formStruct)
            } catch (e) {
              console.error("Error parsing formStruct:", e)
              throw new Error("Invalid form structure format")
            }
          } else if (Array.isArray(response.data.formStruct)) {
            formFields = response.data.formStruct
          }

          console.log("Form fields extracted:", formFields)

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


  // Обработчик изменения полей формы
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    console.log("Submitting form data:", formData)


    const payload = {
      serviceId: service.serviceId || service.id,
      formFields: {
        userFields: {},
        serviceFields: {}
      }
    };
  
    // Заполняем userFields (хардкодные поля)
    const userFieldsList = ["Фамилия", "Имя", "Паспорт", "Снилс", "Почта", "Дата рождения"];
    userFieldsList.forEach(field => {
      payload.formFields.userFields[field] = formData[field] || "";
    });
  
    // Заполняем serviceFields (все остальные поля)
    Object.keys(formData).forEach(key => {
      if (!userFieldsList.includes(key)) {
        payload.formFields.serviceFields[key] = formData[key];
      }
    });
    try {
      const response = await submitForm(payload)
      console.log("Form submission response:", response)

      setSuccessMessage("Форма успешно отправлена!")

      // If we have a record ID, directly show the PDF
      if (response.data) {
        const recordId = response.data

        try {
          const pdfResponse = await getPdfDocument(recordId)
          setPdfData(pdfResponse.data)
          setShowPdfViewer(true)
        } catch (pdfError) {
          console.error("Ошибка при получении PDF:", pdfError)
          setError("Не удалось получить PDF-документ. Пожалуйста, попробуйте позже.")
        }
      } else {
        // If no record ID, just close the form
        onClose()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setError(error.response?.data?.message || "Ошибка отправки формы. Пожалуйста, попробуйте снова.")
    } finally {
      setLoading(false)
    }
  }

  // Close PDF viewer
  const handleClosePdfViewer = () => {
    setShowPdfViewer(false)
    setPdfData(null)
    onClose()
  }

  // If showing PDF viewer, render that instead of the form
  if (showPdfViewer && pdfData) {
    return <PdfViewer pdfData={pdfData} onClose={handleClosePdfViewer} />
  }

  // Show loading state while fetching fields
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

  // If no fields are available, show a message
  if (fields.length === 0) {
    return (
      <div className="modalOverlay">
        <div className="modalContent">
          <h2>{service.name || service.description || "Медицинская услуга"}</h2>
          <div className="error-message">Для данной услуги не определены поля формы.</div>
          <div className="formActions">
            <button type="button" onClick={onClose}>
              Закрыть
            </button>
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
