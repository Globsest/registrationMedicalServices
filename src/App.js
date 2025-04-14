import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import PdfViewerPage from "./components/pdf/PdfViewerPage"
import "./styles/global.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pdf/:recordId" element={<PdfViewerPage />} />
      </Routes>
    </Router>
  )
}

export default App
