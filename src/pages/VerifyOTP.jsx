import axios from "axios";
import React, { useState, useEffect } from "react";

const VerifyOTP = ({ onClose, email, onVerifySuccess }) => {

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/verifyOTP",
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage("OTP verified! Redirecting to password reset...");
        setTimeout(() => {
          onVerifySuccess(email, response.data.token); // Call parent handler instead of navigate
        }, 1500);
      } else {
        setMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("OTP Verification Failed: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setCanResend(false);
      setCountdown(30);
      setMessage("");

      const response = await axios.post(
        "http://127.0.0.1:8080/resendOTP",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "New OTP sent to your email!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    }
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
        onSubmit={handleVerify}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Verify OTP</h2>
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
          <p>We've sent a 6-digit code to</p>
          <p className="font-medium">{email}</p>
        </div>

        <div className="mb-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1.5"
                stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
              />
            </svg>
            <input
              required
              placeholder="Enter 6-digit OTP"
              className="text-black w-full h-10 pl-10 pr-4 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              pattern="\d{6}"
              inputMode="numeric"
            />
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 px-3 py-2 rounded-lg text-sm text-center ${
              message.includes("verified") || message.includes("sent")
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className={`w-full h-10 rounded-lg font-medium text-white relative overflow-hidden transition-all ${
            isLoading || otp.length !== 6
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          }`}
        >
          <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full" />
        </button>

        <div className="mt-4 text-center text-sm text-slate-500">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-blue-500 font-medium hover:text-blue-600 focus:outline-none"
            >
              Resend OTP
            </button>
          ) : (
            <p>Resend OTP in {countdown}s</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;