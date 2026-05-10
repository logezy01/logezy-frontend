import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

// Appliquer le thème sauvegardé avant le rendu
const savedTheme = localStorage.getItem('logezy_theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            background: savedTheme === 'dark' ? '#1A1A1A' : '#fff',
            color: savedTheme === 'dark' ? '#F1F5F9' : '#0F172A',
            border: savedTheme === 'dark' ? '1px solid #2A2A2A' : '1px solid #E2E8F0',
          },
          success: {
            iconTheme: { primary: '#3A7D44', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)