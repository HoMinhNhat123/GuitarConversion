import { createRoot } from 'react-dom/client'
import './index.css'
import { MainCanvas } from './pages/mainCanvas'
import { ProjectPage } from './pages/projectPage'
import {BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainCanvas />} />
      <Route path="/project/:projectId" element={<ProjectPage />} />
    </Routes>
  </BrowserRouter>

)   