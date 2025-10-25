import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Map from './pages/Map.tsx'
import Planner from './pages/Planner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Planner />
  </StrictMode>,
)
