import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8080/login", {
        email,
        password,
      });
      console.log("response", response);

      localStorage.setItem("token", response.data.agentToken);
      localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000); // 1 hour from now
      localStorage.setItem("agentData", JSON.stringify(response.data.agent));
      
      navigate("/delivery/dashboard");
      alert("Login successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <span
        className="text-black cursor-pointer -mt-[650px]"
        onClick={() => navigate(-1)}
      >
        <TiArrowBack size={35} />
      </span>
      <motion.div
        className="max-w-sm bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-3xl font-extrabold text-indigo-600 drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mt-2 text-sm">
          Enter your credentials to access your account
        </p>

        {error && <p className="text-center text-red-500">{error}</p>}

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <input
            required
            className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            name="email"
            placeholder="E-mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full">
            <input
              required
              className="w-full text-slate-600 bg-gray-100 border-none p-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/delivery/register")}
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );

  // return (
  //   <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600">
  //     <motion.div
  //       className="max-w-sm bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mx-auto"
  //       initial={{ opacity: 0, y: -50 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.5 }}
  //     >
  //       <h2 className="text-center text-3xl font-extrabold text-indigo-600 drop-shadow-lg">
  //         Welcome Back
  //       </h2>
  //       <p className="text-center text-gray-500 mt-2 text-sm">
  //         Enter your credentials to access your account
  //       </p>
  //       <form className="mt-6 space-y-5" onSubmit={handleLogin}>
  //         <input
  //           required
  //           className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
  //           type="email"
  //           name="email"
  //           placeholder="E-mail Address"
  //         />
  //         <div className="relative w-full">
  //           <input
  //             required
  //             className="w-full text-slate-600 bg-gray-100 border-none p-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
  //             type={showPassword ? "text" : "password"}
  //             name="password"
  //             placeholder="Password"
  //           />
  //           <button
  //             type="button"
  //             className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
  //             onClick={() => setShowPassword(!showPassword)}
  //           >
  //             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  //           </button>
  //         </div>
  //         <button
  //           type="submit"
  //           className="w-full font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
  //         >
  //           Login
  //         </button>
  //       </form>
  //       <p
  //         className="text-center text-gray-500 text-sm mt-4"
  //         onClick={handleChange}
  //       >
  //         Don't have an account?{" "}
  //         <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
  //           Sign Up
  //         </span>
  //       </p>
  //     </motion.div>
  //   </div>
  // );
};

export default Login;
