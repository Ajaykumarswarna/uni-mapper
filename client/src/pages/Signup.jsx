import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../context/ThemeContext";
import { AiOutlineLoading } from "react-icons/ai";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useContext(ThemeContext); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
      });

      if (response) {
        toast.success("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
  
        toast.error(`Error: ${error.response.data.message}`);
      } else if (error.request) {
      
        toast.error("No response from server. Please try again later.");
      } else {

        toast.error(`Error: ${error.message}`);
      }
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
    <div className="min-h-screen flex flex-col items-center justify-center">
    
      <div className="
        flex flex-col
        bg-white
        shadow-md
        px-4
        sm:px-6
        md:px-8
        lg:px-10
        py-8
        rounded-3xl
        w-50
        max-w-md
      ">
        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          Join us Now
        </div>
        <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
          Enter your credentials to get access account
        </div>
        <div className="mt-10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-5">
              <label htmlFor="name" className="mb-1 text-xs tracking-wide text-gray-600">Name:</label>
              <div className="relative">
               
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    text-sm
                    placeholder-gray-500
                    p-4
                    text-black
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col mb-5">
              <label htmlFor="email" className="mb-1 text-xs tracking-wide text-gray-600">E-Mail Address:</label>
              <div className="relative">
                
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    text-sm
                    text-black
                    placeholder-gray-500
                    p-4
                    rounded-2xl
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Password:</label>
              <div className="relative">
                
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    text-sm
                    placeholder-gray-500
                    p-4
                    
                    rounded-2xl
                    text-black
                    border border-gray-400
                    w-full
                    py-2
                    focus:outline-none focus:border-blue-400
                  "
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <div className="flex w-full">
            <div className="flex w-full">
              <button
                type="submit"
                className={`flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base ${buttonClass} rounded-2xl py-2 w-full transition duration-150 ease-in`}
                disabled={loading} 
              >
                {loading ? (
                  <AiOutlineLoading className="animate-spin" /> 
                ) : (
                  <span className="mr-2 uppercase">SignUp</span>
                )}
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <span className="ml-2">You have an account?</span>
        <Link to={"/login"} className="text-xs ml-2 text-blue-500 font-semibold">Login here</Link>
      </div>
    </div>
  );
};

export default Signup;
