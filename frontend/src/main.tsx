import './index.css';
import App from './App.tsx';
import { Toaster } from 'sonner';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position='top-right'
      visibleToasts={3}
      gap={10}
      expand={true}
      closeButton
    />
    <App />
  </StrictMode>,
)
