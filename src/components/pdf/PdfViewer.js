"use client"

import { useState, useEffect } from "react"
import "../../styles/PdfViewer.css"

const PdfViewer = ({ pdfData, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (pdfData) {
      try {
        // Create a blob URL from the PDF data
        const blob = new Blob([pdfData], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        setLoading(false)

        // Clean up the URL when the component unmounts
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

  return (
    <div className="pdf-viewer-overlay">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h2>Просмотр документа</h2>
          <div className="pdf-viewer-controls">
            <button onClick={downloadPdf} className="pdf-download-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Скачать PDF
            </button>
            <button onClick={onClose} className="pdf-close-btn">
              Закрыть
            </button>
          </div>
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
