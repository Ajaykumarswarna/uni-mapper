/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DAta";
import axios from "axios";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { data, setData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {

    setData({ token: "" });
    localStorage.removeItem("5622User");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };


  const buttonColor =
  theme === "dark"
    ? "bg-blue-600"
    : theme === "solarized"
    ? "bg-yellow-600"
    : theme === "high-contrast"
    ? "bg-white text-black"
    : "bg-blue-400";



  return (
    <div>
      <nav
        className=" w-full fixed navbar shadow shadow-white"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
          <div className="flex items-center w-full justify-between">
            <h1
              className="text-xl font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              UniMapper
            </h1>
            <div className="flex lg:hidden">
              <button
                onClick={handleMenuToggle}
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label="toggle menu"
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 lg:hidden md:hidden flex h-6 bg-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 lg:hidden md:hidden flex h-6 bg-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={`absolute inset-x-0 z-50 w-full px-6 py-4 transition-all duration-300 ease-in-out md:mt-0 md:p-0 md:top-0 top-20 md:relative md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${
              isOpen
                ? "translate-x-0 opacity-100"
                : "opacity-0 -translate-x-full"
            }`}
            style={{ backgroundColor: "var(--background-color)" }}
          >
            <div className="flex gap-4 justify-center items-center flex-col md:flex-row md:mx-6">
              <Link
                to="/"
                className="hover:text-blue-500"
                style={{ color: "var(--text-color)" }}
              >
                Home
              </Link>
              <Link
                to="/notes"
                className="hover:text-blue-500 w-24"
                style={{ color: "var(--text-color)" }}
              >
                My Notes
              </Link>
              {data.token ? (
                <>
                  <button
                  onClick={handleLogout}
                    className={` ${buttonColor} px-4  py-2`}
             
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-blue-500"
                    style={{ color: "var(--text-color)" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-text-color)",
                    }}
                  >
                    Signup
                  </Link>
                </>
              )}

              <div className="ml-4">
                <ThemeSelector/>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
