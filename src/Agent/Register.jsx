import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   agentName: "",
   mailId: "",
   password: "",
   phone: "",
   address: "",
 });

 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");

   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/register",
        formData
      );
      console.log("response",response);
      
      setSuccess(response.data.message);
      localStorage.setItem("token", response.data.agentToken);
      localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000); // 1 hour from now
      localStorage.setItem("agentData", JSON.stringify(response.data.agent));
        
      setTimeout(() => navigate("/delivery/dashboard"), 1500);
      // setTimeout(() => navigate("/delivery/login"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

   return (
     <div className="h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600">
       <motion.div
         className="max-w-sm bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mx-auto"
         initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
       >
         <h2 className="text-center text-3xl font-extrabold text-indigo-600 drop-shadow-lg">
           Create Account
         </h2>
         <p className="text-center text-gray-500 mt-2 text-sm">
           Enter your details to register a new account
         </p>
         {error && <p className="text-red-500 text-center">{error}</p>}
         {success && <p className="text-green-500 text-center">{success}</p>}
         <form className="mt-6 space-y-5" onSubmit={handleRegister}>
           <input
             required
             className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
             type="text"
             name="agentName"
             placeholder="Full Name"
             value={formData.agentName}
             onChange={handleChange}
           />
           <input
             required
             className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
             type="email"
             name="mailId"
             placeholder="E-mail Address"
             value={formData.mailId}
             onChange={handleChange}
           />
           <div className="relative w-full">
             <input
               required
               className="w-full text-slate-600 bg-gray-100 border-none p-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
               type={showPassword ? "text" : "password"}
               name="password"
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
             />
             <button
               type="button"
               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
               onClick={() => setShowPassword(!showPassword)}
             >
               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
           </div>
           <input
             required
             className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
             type="text"
             name="phone"
             placeholder="Phone Number"
             value={formData.phone}
             onChange={handleChange}
             maxLength="10"
           />
           <input
             required
             className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
             type="text"
             name="address"
             placeholder="Address"
             value={formData.address}
             onChange={handleChange}
           />
           <button
             type="submit"
             className="w-full font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
           >
             Sign Up
           </button>
         </form>
         <p className="text-center text-gray-500 text-sm mt-4">
           Already have an account?{" "}
           <span
             className="text-indigo-600 font-semibold cursor-pointer hover:underline"
             onClick={() => navigate("/delivery/login")}
           >
             Login
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
  //         Create Account
  //       </h2>
  //       <p className="text-center text-gray-500 mt-2 text-sm">
  //         Enter your details to register a new account
  //       </p>
  //       <form className="mt-6 space-y-5" onSubmit={handleRegister}>
  //         <input
  //           required
  //           className="w-full text-slate-600 bg-gray-100 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
  //           type="text"
  //           name="name"
  //           placeholder="Full Name"
  //         />
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
  //           Sign Up
  //         </button>
  //       </form>
  //       <p className="text-center text-gray-500 text-sm mt-4">
  //         Already have an account?{" "}
  //         <span
  //           className="text-indigo-600 font-semibold cursor-pointer hover:underline"
  //           onClick={() => navigate("/delivery/login")}
  //         >
  //           Login
  //         </span>
  //       </p>
  //     </motion.div>
  //   </div>
  // );
};

export default Register;
