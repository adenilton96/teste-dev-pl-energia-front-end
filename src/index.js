import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './rotas/Home.js';
import Faturas from './rotas/Faturas.js';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from './components/Sidebar/index.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path='/faturas' element={<Faturas/>}/>
        <Route path='/' element={<Home />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
