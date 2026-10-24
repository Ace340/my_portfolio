import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { bindAccentToAmbientHue } from './color/accentHueBinding.js'

// Own --color-accent from first paint (t = 0 reproduces the @theme fallback
// byte-for-byte, so the default never moves; slider drags update it live — T2).
bindAccentToAmbientHue()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
