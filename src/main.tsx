// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 1. import 하기
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 2. <App />을 <BrowserRouter>로 감싸주기 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)