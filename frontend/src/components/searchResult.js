import React, { useEffect, useState } from "react";
import { fetchWikipediaData } from "./api";
import "../componentCSS/searchResult.css";
import axios from "axios";

const SearchResult = ({ query }) => {
  const [data, setData] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [title, setTitle] = useState("");

  const url = `https://en.wikipedia.org/?curid=${pageId}`;

  //code to fetch all the search result when user enter any query

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWikipediaData(query);
        if (query.length > 0) {
          setData(result.data.query.search);
        }
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [query]);

  const sendPageId = (item, index) => {
    setPageId(item.pageid);
    setTitle(item.title);
    axios
      .post("https://wikimedia-1szr.onrender.com/visited-page", {
        pageId: pageId,
        title: title,
        url: url,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="search-result">
      {!query ? (
        <div className="not-search">
          <h1>Enter Search Query</h1>
        </div>
      ) : data.length > 0 ? (
        data.map((item, index) => {
          const url = `https://en.wikipedia.org/?curid=${item.pageid}`;
          const regex = new RegExp(`(${query})`, "gi");
          const titleWithHighlight = item.title.replace(
            regex,
            '<span class="highlight">$1</span>'
          );
          const snippetWithHighlight = data[index].snippet.replace(
            regex,
            '<span class="highlight">$1</span>'
          );

          return (
            <div className="search-box" key={index}>
              <h2
                className="title"
                dangerouslySetInnerHTML={{ __html: titleWithHighlight }}
              />
              <p
                className="description"
                dangerouslySetInnerHTML={{ __html: snippetWithHighlight }}
              ></p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="read-more-button"
                onClick={() => sendPageId(item, index)}
                // onClick={() => updatePageId(item, index)}
              >
                Read More
              </a>
            </div>
          );
        })
      ) : (
        <div className="not-search">
          <h1>Article Not Found</h1>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
