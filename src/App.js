import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
export default App;