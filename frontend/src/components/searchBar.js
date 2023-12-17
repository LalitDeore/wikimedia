import React from "react";
import { FaSearch } from "react-icons/fa";
import "../componentCSS/searchBar.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchBar = ({ setIsSearch, isLogin, setIsLogin, setQuery, query }) => {
  const updateQuery = (e) => {
    setQuery(e.target.value);
  };

  const location = useLocation();

  if (location.pathname === "/Login" || location.pathname === "/adminPage") {
    setIsLogin(false);
  }

  const checkIsUserSearch = (e) => {
    setIsSearch(true);
    if (e.key === "Enter") {
      axios
        .post("http://localhost:3001/search", { query: query })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="search-bar-box">
      {isLogin && (
        <div className="search-bar">
          <input
            onChange={updateQuery}
            onKeyUp={checkIsUserSearch}
            placeholder="What you are looking for ?"
            value={query}
          ></input>
          <FaSearch />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
