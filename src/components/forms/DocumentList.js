"use client"

import { useState, useEffect } from "react"
import { getDocumentsList, getPdfDocument } from "../../services/api"
import { useSelector } from "react-redux"
import PdfViewer from "../pdf/PdfViewer"

const DocumentsList = () => {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedPdf, setSelectedPdf] = useState(null)
    const { token } = useSelector((state) => state.auth)
  
    useEffect(() => {
      if (!token) return
  
      const loadDocuments = async () => {
        try {
          const response = await getDocumentsList()
          setDocuments(response.data)
        } catch (err) {
          setError(err.response?.data?.message || err.message)
        } finally {
          setLoading(false)
        }
      }
  
      loadDocuments()
    }, [token])
  
    const handleViewPdf = async (recordId) => {
      try {
        const response = await getPdfDocument(recordId)
        setSelectedPdf({
          data: response.data,
          recordId
        })
      } catch (err) {
        setError("Не удалось загрузить документ")
      }
    }
  
    const handleClosePdf = () => {
      setSelectedPdf(null)
    }
  
    if (!token) return <div className="documents-message">Авторизуйтесь для просмотра документов</div>
  
    if (loading) return <div className="documents-loading">Загрузка документов...</div>
  
    if (error) return <div className="documents-error">Ошибка: {error}</div>
  
    return (
      <div className="documents-container">
        {/* <h2>История документов</h2> */}
        
        {documents.length === 0 ? (
          <p className="documents-empty">У вас пока нет сгенерированных документов</p>
        ) : (
          <ul className="documents-list">
            {documents.map((doc) => (
              <li key={doc.recordId} className="document-item">
                <div className="document-info">
                  <span className="document-service">{doc.serviceName}</span>
                  <span className="document-date">
                    {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <button 
                  onClick={() => handleViewPdf(doc.recordId)}
                  className="view-button"
                >
                  Просмотреть
                </button>
              </li>
            ))}
          </ul>
        )}
  
        {selectedPdf && (
          <PdfViewer 
            pdfData={selectedPdf.data} 
            onClose={handleClosePdf}
          />
        )}
      </div>
    )
  }
  
  export default DocumentsList