import React, { useEffect, useRef, useState } from 'react'
import img1 from "../assets/img/logo.png"
import img2 from "../assets/img/figure/admin.jpg"

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar navbar-expand-md header-menu-one bg-light">
            <div className="nav-bar-header-one">
                <div className="header-logo">
                    <a href="index.html">
                        <img src={img1} alt="logo" style={{ width: 100 }} />
                    </a>
                </div>
                <div className="toggle-button sidebar-toggle">
                    <button type="button" className="item-link">
                        <span className="btn-icon-wrap">
                            <span />
                            <span />
                            <span />
                        </span>
                    </button>
                </div>
            </div>
            <div className="d-md-none mobile-nav-bar">
                <button
                    className="navbar-toggler pulse-animation"
                    type="button"
                    data-toggle="collapse"
                    data-target="#mobile-navbar"
                    aria-expanded="false"
                >
                    <i className="fa fa-arrow-down" />
                </button>
                <button type="button" className="navbar-toggler sidebar-toggle-mobile">
                    <i className="fa fa-bars" />
                </button>
            </div>
            <div
                className="header-main-menu collapse navbar-collapse"
                id="mobile-navbar"
            >
                <ul className="navbar-nav">
                    <li className="navbar-item header-search-bar">
                        <div className="input-group stylish-input-group">
                            <span className="input-group-addon">
                                <button type="submit">
                                    <span className="flaticon-search" aria-hidden="true" />
                                </button>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search here"
                            />
                        </div>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <li className="navbar-item dropdown header-admin">
                        {" "}
                        <a className="navbar-nav-link" href="#">
                            <div className="noti">
                                {" "}
                                {/* <i className="fa fa-bell" /> <span className="num">2</span> */}
                                {/* <i class="bi bi-bell-fill"/> <span className="num">2</span> */}
                                <i className="bi bi-bell" /> <span className="num">2</span>
                            </div>
                        </a>
                    </li>
                    <li className="navbar-item dropdown header-admin" ref={dropdownRef} style={{ textDecoration: "none" }}>
                        <a
                            className="navbar-nav-link dropdown-toggle"
                            style={{ textDecoration: "none" }}
                            href="#"
                            role="button"
                            data-toggle="dropdown"
                            aria-expanded="false"
                            onClick={toggleDropdown}
                        >
                            <div className="admin-img mr-3">
                                <img src={img2} alt="Admin" />
                            </div>
                            <div className="admin-title">
                                <h5 className="item-title">John Doe</h5>
                                <span>Admin</span>
                            </div>
                        </a>
                        {dropdownOpen && (
                            <div className="dropdown-menu dropdown-menu-right show">
                                <div className="item-header">
                                    <h6 className="item-title">Steven Zone</h6>
                                </div>
                                <div className="item-content">
                                    <ul className="settings-list">
                                        <li>
                                            <a href="#">
                                                <i className="flaticon-user" />
                                                My Profile
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                localStorage.clear();
                                                window.location.href = "/login";
                                            }}>
                                                <i className="flaticon-turn-off" />
                                                Log Out
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar