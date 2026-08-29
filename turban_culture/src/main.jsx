import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import{ BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' // 1. SEO layi
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* 2. Provider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
