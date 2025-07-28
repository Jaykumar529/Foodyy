import axios from "axios";
import React, { useState } from "react";

const ResetPassword = ({ onClose, email, otpToken, onSuccess }) => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/resetPassword",
        {
          email,
          password,
          token: otpToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          onSuccess(); // Call parent handler instead of navigate
        }, 1500);
      } else {
        setMessage(
          response.data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Password Reset Failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

   const togglePasswordVisibility = () => {
     setShowPassword(!showPassword);
   };
   const toggleConfirmPasswordVisibility = () => {
     setShowConfirmPassword(!showConfirmPassword);
   };


  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1); 
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
            Reset Password
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

        <div className="mb-4 text-sm text-slate-600">
          <p>Reset password for</p>
          <p className="font-medium">{email}</p>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              required
              placeholder="New Password"
              className="text-black w-full h-10 pl-3 pr-10 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              required
              placeholder="Confirm Password"
              className="text-black w-full h-10 pl-3 pr-10 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 px-3 py-2 rounded-lg text-sm text-center ${
              message.includes("successful")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className={`w-full h-10 rounded-lg font-medium text-white relative overflow-hidden transition-all ${
            isLoading || !password || !confirmPassword
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          }`}
        >
          <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full" />
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;