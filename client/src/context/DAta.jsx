import PropTypes from "prop-types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
const DataProvider = ({ children }) => {
    const [data, setData] = useState({
      token: "",
    });
  
    useEffect(() => {
      const storedData = localStorage.getItem("5622User");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log("Parsed Data:", parsedData); // Debug
          setData(parsedData);
        } catch (error) {
          console.error("Error parsing stored data", error);
          localStorage.removeItem("5622User");
        }
      }
    }, []);
  
    useEffect(() => {
      console.log("Data updated:", data); // Debug
      if (data.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      localStorage.setItem("5622User", JSON.stringify(data));
    }, [data]);
  
    return (
      <DataContext.Provider value={{ data, setData }}>
        {children}
      </DataContext.Provider>
    );
  };
  

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useData = () => useContext(DataContext);

export { useData, DataProvider };
