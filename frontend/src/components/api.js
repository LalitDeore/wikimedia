//here i have made AJAX request to fetch data from the wikipedia as it is
//given in the task however we can also fetch data from axios library or by using fetch keyword

export const fetchWikipediaData = (query) => {
  return new Promise((resolve, reject) => {
    if (query === "") return reject("Query cannot be empty");

    const baseURL = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", baseURL, true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ data });
      } else {
        reject(`Request failed with status ${xhr.status}`);
      }
    };

    xhr.onerror = function () {
      reject("Request failed");
    };

    xhr.send();
  });
};
