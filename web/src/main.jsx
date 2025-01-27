import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import Prompts from './pages/Prompts.jsx'
import Reports from './pages/Reports.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Agents from './pages/Agents.jsx'
import CreateAgent from './pages/CreateAgent.jsx'
import EditAgent from './pages/EditAgent.jsx'


import NotFoundPage from './pages/NotFoundPage.jsx' // <-- Import the 404 page

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="agents" element={<Agents />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} /> 
          <Route path="agent/create" element={<CreateAgent />} />
          <Route path="agent/:id/edit" element={<EditAgent />} />
          
          {/* Add other routes as needed */}
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
