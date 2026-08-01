import { createRoot } from 'react-dom/client'
import './index.css'
import { MainCanvas } from './mainCanvas'

createRoot(document.getElementById('root')!).render(
    <MainCanvas />
)
