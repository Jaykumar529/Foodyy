import axios from "axios";
import React, { useState } from "react";

const ForgotPassword = ({ onClose, onSwitch, onSubmit }) => {
  const [input, setInput] = useState({
    mailId: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Validate email on change
    if (name === "mailId") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(input.mailId)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setMessage("");

    try {
      // 1. First verify if email exists
      const response = await axios.post(
        "http://127.0.0.1:8080/verifyEmail",
        {
          mailId: input.mailId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.exists) {
        // 2. If email exists, send OTP
        const otpResponse = await axios.post(
          "http://127.0.0.1:8080/sendOTP",
          { email: input.mailId },
          { headers: { "Content-Type": "application/json" } }
        );

        setMessage("OTP sent! Redirecting to verification...");

        setTimeout(() => {
          onSubmit(input.mailId); // Call parent handler instead of navigate
        }, 1500);
      } else {
        setMessage("Email not found in our database.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Verification Failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); // Fallback if onClose prop isn't provided
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center">
      <form
        className="relative w-[300px] p-6 bg-white rounded-xl shadow-lg border border-slate-200 font-sans"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Forgot Password
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <lord-icon
              src="https://cdn.lordicon.com/vfzqittk.json"
              trigger="hover"
              className="w-8 h-8"
            ></lord-icon>
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
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
              className={`text-black w-full h-10 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:ring-4 transition-all ${
                emailError
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-100"
              }`}
              name="mailId"
              value={input.mailId}
              onChange={handleChange}
              type="email"
            />
          </div>
          {emailError && (
            <p className="mt-1 text-xs text-red-500">{emailError}</p>
          )}
        </div>

        {message && (
          <div
            className={`mb-4 px-3 py-2 rounded-lg text-sm text-center ${
              message.includes("verified")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || emailError}
          className={`w-full h-10 rounded-lg font-medium text-white relative overflow-hidden transition-all ${
            isLoading || emailError
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          }`}
        >
          <span>{isLoading ? "Verifying..." : "Verify Email"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full" />
        </button>

        <div className="mt-4 text-center text-sm text-slate-500">
          <a
            type="button"
            onClick={onSwitch}
            className="hover:text-slate-700 transition-colors"
          >
            Remember your password?{" "}
            <span className="text-blue-500 font-medium hover:text-blue-600">
              Login
            </span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;