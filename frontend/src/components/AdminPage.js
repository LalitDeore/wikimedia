import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";

const AdminPage = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const isAuthenticated = authToken && authToken.length > 0;
  const [visitedPage, setVisitedPage] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const visitedPageChartRef = useRef(null);
  const searchKeywordChartRef = useRef(null);

  //fetch data of all visited page with number of time it visited
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://wikimedia-1szr.onrender.com/visited-page"
        );
        setVisitedPage(
          response.data.filter((item) => item.pageId && item.title && item.url)
        );
      } catch (error) {
        console.log("Error fetching visitedPage data:", error);
      }
    };

    fetchData();
  }, []);

  //fetch data of most search keyword
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://wikimedia-1szr.onrender.com/most-searched-keywords/asc"
        );
        setSearchKeyword(response.data.filter((item) => item.keyword));
      } catch (error) {
        console.log("Error fetching searchKeyword data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Create a bar chart for visited pages using Chart.js
    const visitedPageCtx = document
      .getElementById("visitedPageChart")
      .getContext("2d");

    // Destroy the previous chart instance if it exists
    if (visitedPageChartRef.current) {
      visitedPageChartRef.current.destroy();
    }

    const visitedPageData = visitedPage.map((item) => ({
      label: item.title,
      data: [item.count],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    }));

    const visitedPageChartOptions = {
      scales: {
        x: {},
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    // Create a new chart instance for visited pages
    const newVisitedPageChartInstance = new Chart(visitedPageCtx, {
      type: "bar",
      data: { labels: ["Count"], datasets: visitedPageData },
      options: visitedPageChartOptions,
    });

    visitedPageChartRef.current = newVisitedPageChartInstance;
  }, [visitedPage]);

  useEffect(() => {
    // Create a bar chart for search keywords using Chart.js
    const searchKeywordCtx = document
      .getElementById("searchKeywordChart")
      .getContext("2d");

    // Destroy the previous chart instance if it exists
    if (searchKeywordChartRef.current) {
      searchKeywordChartRef.current.destroy();
    }

    const searchKeywordData = searchKeyword.map((item) => ({
      label: item.keyword,
      data: [item.count],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    }));

    const searchKeywordChartOptions = {
      scales: {
        x: {},
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    // Create a new chart instance for search keywords
    const newSearchKeywordChartInstance = new Chart(searchKeywordCtx, {
      type: "bar",
      data: { labels: ["Count"], datasets: searchKeywordData },
      options: searchKeywordChartOptions,
    });

    // Save the new chart instance to the ref
    searchKeywordChartRef.current = newSearchKeywordChartInstance;
  }, [searchKeyword]);

  return (
    <div
      className="admin-panel"
      style={{ display: "flex", justifyContent: "center", gap: "40px" }}
    >
      <div style={{ width: "40%" }}>
        <h2>Visited Page Data</h2>
        <canvas id="visitedPageChart" width="200" height="100"></canvas>
      </div>

      <div style={{ width: "40%" }}>
        <h2>Search Keyword Data</h2>
        <canvas id="searchKeywordChart" width="200" height="100"></canvas>
      </div>

      {isAuthenticated ? null : navigate("/login")}
    </div>
  );
};

export default AdminPage;
