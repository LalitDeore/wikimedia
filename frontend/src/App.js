// App.js
import "./App.css";
import SearchBar from "./components/searchBar";
import SearchResult from "./components/searchResult";
import Login from "./components/Login";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import AdminPage from "./components/AdminPage";

function App() {
  const [query, setQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <BrowserRouter>
      <div className="App">
        <div className="header">
          <LoginButton isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
        <h1>Welcome to MediaWiki</h1>
        <div className="searchBar">
          <SearchBar
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            setQuery={setQuery}
            query={query}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
          />
        </div>
        <Routes>
          <Route path="/" element={<SearchResult query={query} />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/adminPage" element={<AdminPage isLogin={isLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
