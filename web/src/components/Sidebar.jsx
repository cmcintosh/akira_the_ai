import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <nav id="sidebar" className="sidebar-wrapper">
      <div className="app-brand mb-3">
        <Link to="/">
          <img src="/assets/images/logo.svg" className="logo" alt="Axis Bootstrap Template" />
        </Link>
      </div>

      <div className="sidebarMenuScroll">
        <ul className="sidebar-menu">
          <li className="active current-page">
            <Link to="/agents">
              <i className="bi bi-laptop"></i>
              <span className="menu-text">Agents</span>
            </Link>
          </li>
          <li>
            <Link to="/prompts">
              <i className="bi bi-filter-square"></i>
              <span className="menu-text">Prompts</span>
            </Link>
          </li>
          <li>
            <Link to="/reports">
              <i className="bi bi-bar-chart-line"></i>
              <span className="menu-text">Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/commands">
              <i className="bi bi-clipboard-check"></i>
              <span className="menu-text">Commands</span>
            </Link>
          </li>
          
          <li>
            <Link to="/settings">
              <i className="bi bi-gear"></i>
              <span className="menu-text">Settings</span>
            </Link>
          </li>
          <li>
            <Link to="/faq">
              <i className="bi bi-chat"></i>
              <span className="menu-text">Faq's</span>
            </Link>
          </li>
          <li>
            <Link to="/contact-us">
              <i className="bi bi-phone-vibrate"></i>
              <span className="menu-text">Contact Us</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-settings gap-1 d-lg-flex d-none">
        <Link to="/profile" className="settings-icon" data-bs-toggle="tooltip" title="Profile">
          <i className="bi bi-person"></i>
        </Link>
        <Link to="/commands" className="settings-icon" data-bs-toggle="tooltip" title="Tasks">
          <i className="bi bi-clipboard-check"></i>
        </Link>
        <Link to="/widgets" className="settings-icon" data-bs-toggle="tooltip" title="Widgets">
          <i className="bi bi-box"></i>
        </Link>
        <Link to="/settings" className="settings-icon" data-bs-toggle="tooltip" title="Settings">
          <i className="bi bi-gear"></i>
        </Link>
        <Link to="/login" className="settings-icon" data-bs-toggle="tooltip" title="Logout">
          <i className="bi bi-power"></i>
        </Link>
      </div>
    </nav>
  )
}

export default Sidebar
