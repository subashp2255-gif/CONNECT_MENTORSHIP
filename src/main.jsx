import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import SplashScreen from './components/ui/SplashScreen'
import './index.css'
import { useStore } from './store/useStore'

function Root() {
  const [showSplash, setShowSplash] = useState(true)
  const { themeMode } = useStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', themeMode === 'dark')
    root.classList.toggle('light', themeMode === 'light')
  }, [themeMode])

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16161e',
            color: '#fff',
            border: '1px solid #2a2a3a'
          }
        }}
      />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
