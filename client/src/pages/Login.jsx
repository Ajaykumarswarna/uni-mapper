/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useData } from "../context/DAta";
import { ThemeContext } from "../context/ThemeContext"; 
import { AiOutlineLoading } from "react-icons/ai"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { data, setData } = useData();
  const { theme } = useContext(ThemeContext); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(""); 
  
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
  
      const { token } = response.data;
      setData({ token: response.data.token });
      localStorage.setItem("5622User", JSON.stringify({ token }));
  
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const buttonClass =
    theme === "dark"
      ? "bg-blue-600"
      : theme === "solarized"
      ? "bg-[#ca8a04]"
      : theme === "high-contrast"
      ? "bg-[#ffcc00] text-black"
      : "bg-blue-400";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center`}>
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-md">
        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          Welcome Back
        </div>
        <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
          Enter your credentials to access your account
        </div>
        <div className="mt-10">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col mb-5">
              <label
                htmlFor="email"
                className="mb-1 text-xs tracking-wide text-gray-600"
              >
                E-Mail Address:
              </label>
              <div className="relative">
              
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm placeholder-gray-500 p-4 text-black rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm placeholder-gray-500 p-4 text-black rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex w-full">
              <button
                type="submit"
                className={`flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base ${buttonClass} rounded-2xl py-2 w-full transition duration-150 ease-in`}
                disabled={loading} 
              >
                {loading ? (
                  <AiOutlineLoading className="animate-spin" /> 
                ) : (
                  <span className="mr-2 uppercase">Log In</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <span className="ml-2">You don't have an account?</span>
        <Link
          to={"/signup"}
          className={`text-xs ml-2 text-blue-500 font-semibold`}
        >
          Register now
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
