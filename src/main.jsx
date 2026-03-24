import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SplashScreen from './components/ui/SplashScreen'
import './index.css'

function Root() {
  const [showSplash, setShowSplash] = useState(true)
  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <App />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
