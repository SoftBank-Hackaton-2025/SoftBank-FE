// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 👇 1. [신규] BrowserRouter를 import 합니다.
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 2. <App />을 <BrowserRouter>로 감싸줍니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);