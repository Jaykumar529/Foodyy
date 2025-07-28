import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const DeliveryLayout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set to true if token exists
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // Set login state to true
    navigate("/delivery/login");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col">
      {/* Show Navbar only when logged in */}
      {isLoggedIn && (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Delivery Hub</h1>
          <button
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
            onClick={() => setIsLoggedIn(false)}
          >
            Logout
          </button>
        </nav>
      )}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow text-center text-white p-6">
        <motion.h2
          className="text-5xl font-extrabold drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Deliver with Speed & Efficiency
        </motion.h2>
        <p className="text-lg mt-4 max-w-lg font-light">
          Join our network of trusted delivery agents and make food deliveries
          seamless and rewarding.
        </p>
        {/* Show login button only when not logged in */}
        {!isLoggedIn && (
          <button
            className="mt-6 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>

      <Outlet />
    </div>
  );
};

export default DeliveryLayout;
