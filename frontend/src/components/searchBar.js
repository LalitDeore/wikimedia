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
  //don't show search bar to login and adminPage
  if (location.pathname === "/Login" || location.pathname === "/adminPage") {
    setIsLogin(false);
  }

  if (location.pathname === "/") {
    setIsLogin(true);
  }

  //store keyword when user enter anyword
  const checkIsUserSearch = (e) => {
    setIsSearch(true);
    if (e.key === "Enter") {
      axios
        .post("https://wikimedia-1szr.onrender.com/search", { query: query })
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
          <h1>Welcome to MediaWiki</h1>
          <div className="search-input">
            <input
              onChange={updateQuery}
              onKeyUp={checkIsUserSearch}
              placeholder="What you are looking for ?"
              value={query}
            ></input>
            <FaSearch />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
