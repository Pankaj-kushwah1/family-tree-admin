import React, { useState, useEffect, useRef } from 'react';
import img from "../assets/img/logo-white.png";
import "../assets/css/login.css";
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';
import { loginAdmin } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);
    const phoneInputRef = useRef(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const newErrors = {};

        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!validateEmail(email)) newErrors.email = "Enter a valid email.";

        if (!password.trim()) newErrors.password = "Password is required.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);
            const res = await loginAdmin({ email, password });

            if (res.success) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("userData", JSON.stringify(res.user));
                navigate("/");
            } else {
                setServerError(res.message || "Login failed.");
            }
        } catch (error) {
            setServerError(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (phoneInputRef.current) {
            intlTelInput(phoneInputRef.current, {
                initialCountry: "in",
                separateDialCode: true,
                preferredCountries: ["in", "us", "gb"],
                utilsScript:
                    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            });
        }
    }, []);

    return (
        <div className="container">
            <div className="main-wrapper">
                <div className="left-panel">
                    <img src={img} className="logo" alt="Logo" />
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

                        {serverError && (
                            <div className="alert alert-danger text-center mt-3">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            {/* <div className="form-group">
// //                                 <label>Mobile Number</label>
// //                                 <input
// //                                     ref={phoneInputRef}
// //                                     id="phone"
// //                                     type="tel"
// //                                     className="form-control"
// //                                     placeholder=""
// //                                 />
// //                             </div> */}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && (
                                    <small className="text-danger">{errors.email}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && (
                                    <small className="text-danger">{errors.password}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    <input type="checkbox" /> Remember Me
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-black btn-block radius-30 btn-login"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "LOGIN"}
                            </button>

                            <a href="forgot-password.html" className="forgot-password">
                                FORGOT PASSWORD
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
