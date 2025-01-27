import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  return (
    <div className="page-wrapper">
      <div className="main-container">
        <Sidebar />
        <div className="app-container">
          <Header />
          <div className="app-body">
            {/* This is where the routed pages will appear */}
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
