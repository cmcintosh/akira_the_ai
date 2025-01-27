import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="app-header d-flex align-items-center">
      <div className="d-flex">
        <button className="pin-sidebar">
          <i className="bi bi-list lh-1"></i>
        </button>
      </div>

      <div className="app-brand-sm d-lg-none d-flex">
        <Link to="/">
          <img src="/assets/images/logo-sm.svg" className="logo" alt="Axis Bootstrap Template" />
        </Link>
      </div>

      <div className="d-flex align-items-center ms-3">
        <h5 className="m-0">Akira Control Panel</h5>
      </div>

      <div className="header-actions">
        <div className="search-container d-xl-block d-none mx-3">
          <input type="text" className="form-control" id="searchData" placeholder="Search" />
          <i className="bi bi-search"></i>
        </div>

        <div className="dropdown ms-4">
          <a id="userSettings" className="dropdown-toggle d-flex py-2 align-items-center" href="#!" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/assets/images/user.png" className="rounded-4 img-3x" alt="Bootstrap Gallery" />
            <div className="ms-2 text-truncate d-lg-flex flex-column d-none">
              <p className="text-truncate m-0">Cavemancrafting</p>
              <span className="small opacity-50 lh-1">Admin</span>
            </div>
          </a>
          <div className="dropdown-menu dropdown-menu-end shadow-lg">
            <Link className="dropdown-item d-flex align-items-center" to="/profile"><i
                className="bi bi-person fs-5 me-2"></i>My Profile</Link>
            <Link className="dropdown-item d-flex align-items-center" to="/settings"><i
                className="bi bi-gear fs-5 me-2"></i>Settings</Link>
            <Link className="dropdown-item d-flex align-items-center" to="/reset-password"><i
                className="bi bi-slash-circle fs-5 me-2"></i>Reset Password</Link>
            <div className="mx-3 mt-2 d-grid">
              <Link to="/login" className="btn btn-primary">Logout</Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Header
