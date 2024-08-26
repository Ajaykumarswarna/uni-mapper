import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { theme, setSpecificTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
    { name: "Solarized", value: "solarized" },
    { name: "High Contrast", value: "high-contrast" },
  ];

  return (
    <div className="relative w-44 rounded-lg z-50 inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L10 5.414 6.707 8.707A1 1 0 015.293 7.293l4-4A1 1 0 0110 3zm0 14a1 1 0 01-.707-.293l-4-4A1 1 0 016.707 11.293l3.293 3.293 3.293-3.293A1 1 0 0114.707 12.707l-4 4A1 1 0 0110 17z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right rounded-xl absolute right-0 mt-2 w-56 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className=" bg-white" role="none">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setSpecificTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm `}
                role="menuitem"
              >
                {themeOption.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
