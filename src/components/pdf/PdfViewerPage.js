"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPdfDocument } from "../../services/api"
import PdfViewer from "./PdfViewer"
import "../../styles/PdfViewer.css"

const PdfViewerPage = () => {
  const { recordId } = useParams()
  const navigate = useNavigate()
  const [pdfData, setPdfData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPdf = async () => {
      if (!recordId) {
        setError("Не указан ID записи")
        setLoading(false)
        return
      }

      try {
        const response = await getPdfDocument(recordId)
        setPdfData(response.data)
      } catch (err) {
        console.error("Error fetching PDF:", err)
        setError("Не удалось загрузить PDF. Пожалуйста, попробуйте позже.")
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()
  }, [recordId])

  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }

  if (loading) {
    return (
      <div className="pdf-page-container">
        <div className="pdf-loading">Загрузка PDF...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pdf-page-container">
        <div className="pdf-error">{error}</div>
        <button onClick={handleClose} className="pdf-close-btn">
          Назад
        </button>
      </div>
    )
  }

  return <PdfViewer pdfData={pdfData} onClose={handleClose} />
}

export default PdfViewerPage
