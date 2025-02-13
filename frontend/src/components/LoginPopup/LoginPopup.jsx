import React, { useContext, useState } from 'react'
import './LoginPopup.scss'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
        setError("");
    }

    const onLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
            const apiUrl = `${url}${endpoint}`;

            const response = await axios.post(apiUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                setError(response.data.message || "An error occurred");
            }
        } catch (error) {
            console.error("Login/Register error:", error);
            setError(error.response?.data?.message || "Network error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div className="login-popup-inputs">
                    {currState === "Sign up" && (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>
                <button
                    type='submit'
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Please wait..." : (currState === "Sign up" ? "Create account" : "Login")}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use and privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState("Sign up")}> Click here </span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}> Login here </span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup