import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'

const Login = ({ onClose, onSwitch, onLoginSuccess, onForgotPassword }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [input, setInput] = useState({
    mailId: "",
    password: "",
  });
  const [error, setError] = useState(""); // Added error state
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/addLoginUser",
        input,
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful");

        // call the onLoginSuccess function to update the navbar
        onLoginSuccess(response.data.token);
        onClose();
      } else {
        console.error("Token not received");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed - please try again";
      setError(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  return (
    <StyledWrapper className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <form
        className="modern-form w-full max-w-md md:max-w-lg lg:max-w-xl"
        onSubmit={handleSubmit}
      >
        <div className="form-title flex justify-between items-center">
          Login
          <button type="button" onClick={onClose}>
            <lord-icon
              src="https://cdn.lordicon.com/vfzqittk.json"
              trigger="hover"
              className="w-7 h-7 md:w-8 md:h-8"
            ></lord-icon>
          </button>
        </div>

        <div className="form-body">
          <div className="input-group">
            <div className="input-wrapper">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="input-icon w-5 h-5 text-gray-500 mr-2"
              >
                <path
                  strokeWidth="1.5"
                  stroke="currentColor"
                  d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                />
              </svg>
              <input
                required
                placeholder="Email"
                className="form-input"
                name="mailId"
                value={input.mailId}
                onChange={handleChange}
                type="email"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                <path
                  strokeWidth="1.5"
                  stroke="currentColor"
                  d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                />
              </svg>
              <input
                required
                placeholder="Password"
                className="form-input"
                name="password"
                value={input.password}
                onChange={handleChange}
                type={passwordVisible ? "text" : "password"}
              />
              <button
                className="absolute right-3"
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="eye-icon w-5 h-5 text-gray-500"
                >
                  {passwordVisible ? <Eye /> : <EyeClosed />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* try  */}
        {/* <p
          className="text-blue-600 text-right cursor-pointer mt-2 hover:text-blue-400 text-sm"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p> */}
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-500 hover:underline pl-32"
        >
          Forgot Password?
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}

        <button
          className="submit-button mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          <span>Let's go</span>
          <div className="button-glow"></div>
        </button>

        <div className="form-footer mt-4 text-center">
          <a
            className="login-link text-sm text-gray-600"
            href="#"
            onClick={onSwitch}
          >
            Don't have an account?{" "}
            <span className="text-blue-600">Sign Up</span>
          </a>
        </div>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .modern-form {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --primary-light: rgba(59, 130, 246, 0.1);
    --success: #10b981;
    --text-main: #1e293b;
    --text-secondary: #64748b;
    --bg-input: #f8fafc;

    position: relative;
    width: 300px;
    padding: 24px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.05),
      inset 0 0 0 1px rgba(148, 163, 184, 0.1);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .form-title {
    font-size: 22px;
    font-weight: 600;
    color: var(--text-main);
    margin: 0 0 24px;
    text-align: center;
    letter-spacing: -0.01em;
  }

  .input-group {
    margin-bottom: 16px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    height: 40px;
    padding: 0 36px;
    font-size: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: var(--bg-input);
    color: var(--text-main);
    transition: all 0.2s ease;
  }

  .form-input::placeholder {
    color: var(--text-secondary);
  }

  .input-icon {
    position: absolute;
    left: 12px;
    width: 16px;
    height: 16px;
    color: var(--text-secondary);
    pointer-events: none;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    display: flex;
    align-items: center;
    padding: 4px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .eye-icon {
    width: 16px;
    height: 16px;
  }

  .submit-button {
    position: relative;
    width: 100%;
    height: 40px;
    margin-top: 8px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .button-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .form-footer {
    margin-top: 16px;
    text-align: center;
    font-size: 13px;
  }

  .login-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .login-link span {
    color: var(--primary);
    font-weight: 500;
  }

  /* Hover & Focus States */
  .form-input:hover {
    border-color: #cbd5e1;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px var(--primary-light);
  }

  .password-toggle:hover {
    color: var(--primary);
    transform: scale(1.1);
  }

  .submit-button:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25),
      0 2px 4px rgba(59, 130, 246, 0.15);
  }

  .submit-button:hover .button-glow {
    transform: translateX(100%);
  }

  .login-link:hover {
    color: var(--text-main);
  }

  .login-link:hover span {
    color: var(--primary-dark);
  }

  /* Active States */
  .submit-button:active {
    transform: translateY(0);
    box-shadow: none;
  }

  .password-toggle:active {
    transform: scale(0.9);
  }

  /* Validation States */
  .form-input:not(:placeholder-shown):valid {
    border-color: var(--success);
  }

  .form-input:not(:placeholder-shown):valid ~ .input-icon {
    color: var(--success);
  }

  /* Animation */
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-4px);
    }
    75% {
      transform: translateX(4px);
    }
  }

  .form-input:not(:placeholder-shown):invalid {
    border-color: #ef4444;
    animation: shake 0.2s ease-in-out;
  }

  .form-input:not(:placeholder-shown):invalid ~ .input-icon {
    color: #ef4444;
  }
`;

export default Login;

