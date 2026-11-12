import React, { useState, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(prev => ({ ...prev, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    setLoading(true)

    let newUrl = url
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl, data)

      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        setShowLogin(false)
      } else {
        alert(response.data.message || "Authentication failed")
      }
    } catch (error) {
      console.error("Auth error:", error)
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong. Please try again."
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">

        {/* Title */}
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        {/* Inputs */}
        <div className="login-popup-inputs">
          {currState !== "Login" && (
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
            placeholder="Your password"
            required
          />
        </div>

        {/* Button */}
        <button type='submit' disabled={loading} style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
          {loading ? "Connecting..." : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>

        {/* Terms */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>

        {/* Toggle Login / Signup */}
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  )
}

export default LoginPopup
