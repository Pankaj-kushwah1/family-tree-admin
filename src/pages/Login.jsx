import React, { useEffect, useRef } from 'react'
import img from "../assets/img/logo-white.png"
import "../assets/css/login.css"
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

const Login = () => {
    const phoneInputRef = useRef(null);

    // useEffect(() => {
    //     if (phoneInputRef.current) {
    //         intlTelInput(phoneInputRef.current, {
    //             initialCountry: "gb",
    //             preferredCountries: ["gb", "us", "in"],
    //             separateDialCode: true,
    //             utilsScript:
    //                 "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
    //         });
    //     }
    // }, []);

    useEffect(() => {
        if (phoneInputRef.current) {
            intlTelInput(phoneInputRef.current, {
                initialCountry: "in",
                separateDialCode: true,
                preferredCountries: ["in", "us", "gb"],
                utilsScript:
                    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js", // this one still needs a script link unless bundled locally
            });
        }
    }, []);

    return (
        <div className="container">
            <div className="main-wrapper">
                <div className="left-panel">
                    <img src={img} className="logo" alt="Logo" />{" "}
                </div>
                <div className="right-panel">
                    <div className="login-card">
                        <div className="text-center">
                            <div className="login-title">ADMIN LOGIN</div>
                            <select className="language-select p-2">
                                <option>English</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                        <form>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    ref={phoneInputRef}
                                    id="phone"
                                    type="tel"
                                    className="form-control"
                                    placeholder=""
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <input type="checkbox" /> Remember Me
                                </label>
                            </div>
                            <button type="submit" className="btn btn-black btn-block radius-30 btn-login">
                                LOGIN
                            </button>
                            <a href="forgot-password.html" className="forgot-password">
                                FORGOT PASSWORD
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login