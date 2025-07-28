import axios from "axios";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Login from "../../pages/Login";
import SignUp from "../../pages/SignUp";
import { useCart } from "../user/CartContext";
import ForgotPassword from "../../pages/ForgotPassword";
import ResetPassword from "../../pages/ResetPassword"; 
import VerifyOTP from "../../pages/VerifyOTP"; 

const Navbar = () => {
  const [showPage, setShowPage] = useState(null); // null = closed, "login" = show login, "signup" = show signup
  const { cart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [emailForReset, setEmailForReset] = useState(""); //  this state for password reset flow

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(!!true); //convert token to boolean
    }
  }, [isLoggedIn]);

  const handleOpen = (page) => {
    setShowPage(page);
    setMobileMenuOpen(false); // Close mobile menu when auth modal opens
  };
  const handleClose = () => setShowPage(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/logout", {
        Credential: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        alert("Successfully logout!");
        navigate("/");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("home");

  const handleClick = (tab, sectionId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu when a link is clicked
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add these handlers for the password reset flow
  const handleForgotPassword = (email) => {
    setEmailForReset(email);
    setShowPage("verifyotp");
  };

  const handleOTPVerified = (email, token) => {
    setEmailForReset(email);
    setShowPage("resetpassword");
  };

  return (
    <div>
      <nav className="bg-[#fcf8ed] border-gray-200 h-20 pt-4 px-6 py-10">
        {/* lg:px-16 lg:mx-16 */}
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link to="/" className="flex items-center">
              <h1 className="text-4xl font-bold text-center">
                <span className="text-orange-500">Food</span>
                <span className="text-[#a32424]">yy</span>
              </h1>
            </Link>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <Link to="/cart" className="relative mr-4">
                <ShoppingBag className="text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {cart.reduce((total, item) => total + item.count, 0)}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } w-full lg:flex lg:w-auto lg:order-1 z-10`}
            id="mobile-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={`block py-2 pr-4 pl-3 ${
                    activeTab === "home" ? "text-red-700" : "text-black"
                  } duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`}
                  onClick={() => handleClick("home", "home")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={`block py-2 pr-4 pl-3 ${
                    activeTab === "menu" ? "text-red-700" : "text-black"
                  } duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`}
                  onClick={() => handleClick("menu", "goslider")}
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={`block py-2 pr-4 pl-3 ${
                    activeTab === "contact" ? "text-red-700" : "text-black"
                  } duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`}
                  onClick={() => handleClick("contact", "contact")}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={`block py-2 pr-4 pl-3 ${
                    activeTab === "service" ? "text-red-700" : "text-black"
                  } duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`}
                  onClick={() => handleClick("service", "services")}
                >
                  Service
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center lg:order-2">
            <Link to="/cart" className="relative mr-4">
              <ShoppingBag className="text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                  {cart.reduce((total, item) => total + item.count, 0)}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3 ">
                <Link to="/profile">
                  <User className="text-gray-600 cursor-pointer" size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-200 bg-red-500 hover:bg-red-600 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div
                onClick={() => handleOpen("login")}
                className="text-gray-500 hover:text-gray-200 hover:bg-orange-500 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none cursor-pointer"
              >
                Log in
              </div>
            )}
          </div>

          {/* Mobile Auth Buttons - shown only when menu is open */}
          {mobileMenuOpen && (
            <div className="w-full lg:hidden mt-4 bg-slate-200 z-10">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2" size={20} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-200 bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleOpen("login")}
                  className="w-full text-left text-gray-700 hover:bg-gray-100 py-2 px-3 rounded"
                >
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modals */}
      {showPage === "login" && (
        <Login
          onClose={handleClose}
          onSwitch={() => handleOpen("signup")}
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => handleOpen("forgot")}
        />
      )}
      {showPage === "signup" && (
        <SignUp
          onClose={handleClose}
          onSwitch={() => handleOpen("login")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showPage === "forgot" && (
        <ForgotPassword
          onClose={handleClose}
          onSwitch={() => handleOpen("login")}
          onSubmit={handleForgotPassword} // Pass email to VerifyOTP
        />
      )}
      {showPage === "verifyotp" && (
        <VerifyOTP
          onClose={handleClose}
          email={emailForReset}
          onVerifySuccess={handleOTPVerified} // Pass to ResetPassword after verification
        />
      )}
      {showPage === "resetpassword" && (
        <ResetPassword
          onClose={handleClose}
          email={emailForReset}
          onSuccess={() => handleOpen("login")} // After reset, go back to login
        />
      )}
    </div>
  );
};

export default Navbar;