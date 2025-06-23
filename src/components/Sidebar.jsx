import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import "remixicon/fonts/remixicon.css";

const Sidebar = () => {
    const location = useLocation();
    return (
        < div className="sidebar-main sidebar-menu-one sidebar-expand-md sidebar-color" >
            <div className="mobile-sidebar-header d-md-none">
                <div className="header-logo">
                    <a href="index.html">
                        <img src="img/logo1.png" alt="logo" style={{ width: 100 }} />
                    </a>
                </div>
            </div>
            <div className="sidebar-menu-content">
                <ul className="nav nav-sidebar-menu sidebar-toggle-view">
                    <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                        <Link to="/" className="nav-link">
                            <i className="flaticon-menu-1" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/users-list" ? "active" : ""}`}>
                        <Link to="/users-list" className="nav-link">
                            <i className="fa fa-users" />
                            <span>Users</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/help-support" ? "active" : ""}`}>
                        <Link to="/help-support" className="nav-link">
                            <i className="fa fa-headphones" />
                            <span>Help &amp; Support</span>
                        </Link>
                    </li>
                   <li className={`nav-item ${location.pathname === "/privacy" ? "active" : ""}`}>
  <Link to="/privacy" className="nav-link">
    <i className="ri-shield-user-line" />
    <span>Privacy &amp; Policy</span>
  </Link>
</li>

<li className={`nav-item ${location.pathname === "/terms" ? "active" : ""}`}>
  <Link to="/terms" className="nav-link">
    <i className="ri-file-text-line" />
    <span>Terms &amp; Conditions</span>
  </Link>
</li>


                </ul>
            </div>
        </div >
    )
}

export default Sidebar