"use client"

import { useState, useEffect } from "react"
import { sendPdfByEmail } from "../../services/api" // Импортируем новую функцию
import "../../styles/PdfViewer.css"

const PdfViewer = ({ pdfData, onClose, recordId }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState("")

  useEffect(() => {
    if (pdfData) {
      try {
        const blob = new Blob([pdfData], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        setLoading(false)

        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (err) {
        console.error("Error creating PDF URL:", err)
        setError("Не удалось загрузить PDF. Пожалуйста, попробуйте скачать файл.")
        setLoading(false)
      }
    }
  }, [pdfData])

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.setAttribute("download", "document.pdf")
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  const handleSendEmail = async () => {
    if (!email) return setEmailStatus("Введите email")
    try {
      const response = await sendPdfByEmail(recordId, email)
      setEmailStatus(`Успешно отправлено на ${email}`)
    } catch (err) {
      console.error("Ошибка при отправке:", err)
      setEmailStatus("Ошибка при отправке PDF. Попробуйте снова.")
    }
  }

  return (
    <div className="pdf-viewer-overlay">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h2>Просмотр документа</h2>
          <div className="pdf-viewer-controls">
            <button onClick={downloadPdf} className="pdf-download-btn">Скачать PDF</button>
            <button onClick={onClose} className="pdf-close-btn">Закрыть</button>
          </div>
        </div>

        <div className="pdf-email-send">
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pdf-email-input"
          />
          <button onClick={handleSendEmail} className="pdf-email-btn">Отправить на Email</button>
          {emailStatus && <p className="pdf-email-status">{emailStatus}</p>}
        </div>

        {loading ? (
          <div className="pdf-loading">Загрузка PDF...</div>
        ) : error ? (
          <div className="pdf-error">{error}</div>
        ) : (
          <div className="pdf-document-container">
            <iframe src={`${pdfUrl}#toolbar=0`} title="PDF Viewer" className="pdf-iframe" width="100%" height="100%" />
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfViewer
