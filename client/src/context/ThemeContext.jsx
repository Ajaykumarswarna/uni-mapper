import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to root element
    document.documentElement.className = theme;
    // Save theme to local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes
    setTheme((prevTheme) => {
      const themes = ["light", "dark", "solarized", "high-contrast"];
      const nextIndex = (themes.indexOf(prevTheme) + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  const setSpecificTheme = (themeName) => {
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSpecificTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Prop validation
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
