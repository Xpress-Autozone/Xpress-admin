import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from './MainLayout/mainlayout'
import { AuthProvider } from './Contexts/authContext';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <AuthProvider>

    <MainLayout />

    </AuthProvider>
  </StrictMode>,
)
