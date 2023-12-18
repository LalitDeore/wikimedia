const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Secret key for JWT token
const secretKey = crypto.randomBytes(32).toString("hex");

// Middleware to authenticate admin
function authenticateAdmin(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.role !== "admin") {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  // by default used email id and password for admin
  const admin = {
    username: "admin@gmail.com",
    password: "admin@123",
    role: "admin",
    _id: "unique-admin-id",
  };

  if (email === admin.username && password === admin.password) {
    const token = jwt.sign({ userId: admin._id, role: admin.role }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect();

//end point to search word in wikipedia and it return search result it array of JSON format

app.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const result = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${searchTerm}`
    );
    res.json(result.data.query.search);
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//this end point return all data that are search in html format at this endpoint

app.get("/read/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    const result = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${slug}`
    );
    const { title, text } = result.data.parse;

    res.json({
      title,
      htmlContent: text["*"],
    });
  } catch (error) {
    console.error("Error reading:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//this end point store search keyword in mongodb data base

app.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const db = client.db("MiniWiki");
  const searches = db.collection("searchKeyword");

  // Check if the query already exists
  const existingQuery = await searches.findOne({ query });

  if (existingQuery) {
    // If the query exists, update the count
    await searches.updateOne(
      { query },
      { $inc: { count: 1 }, $set: { timestamp: new Date() } }
    );
  } else {
    // If the query doesn't exist, insert a new record
    await searches.insertOne({ query, count: 1, timestamp: new Date() });
  }

  res.json({ success: true });
});

//this endpoint return all visited page by user to show in the admin panel
app.get("/visited-page", async (req, res) => {
  const { pageId, title, url } = req.body;

  const db = client.db("MiniWiki");
  const visits = db.collection("visitedPage");

  // Check if the pageId already exists
  const existingPage = await visits.findOne({ pageId });

  if (existingPage) {
    // If the pageId exists, update the count and timestamp
    await visits.updateOne(
      { pageId },
      { $inc: { count: 1 }, $set: { title, url, timestamp: new Date() } }
    );
  } else {
    // If the pageId doesn't exist, insert a new record
    await visits.insertOne({
      pageId,
      title,
      url,
      count: 1,
      timestamp: new Date(),
    });
  }

  const allVisits = await visits.find({}).toArray();

  res.json(allVisits);
});

//this end point store the data of visited page to mongo db database

app.post("/visited-page", async (req, res) => {
  const { pageId, title, url } = req.body;

  const db = client.db("MiniWiki");
  const visits = db.collection("visitedPage");

  // Check if the pageId already exists
  const existingPage = await visits.findOne({ pageId });

  if (existingPage) {
    // If the pageId exists, update the count and timestamp
    await visits.updateOne(
      { pageId },
      { $inc: { count: 1 }, $set: { title, url, timestamp: new Date() } }
    );
  } else {
    // If the pageId doesn't exist, insert a new record
    await visits.insertOne({
      pageId,
      title,
      url,
      count: 1,
      timestamp: new Date(),
    });
  }

  const allVisits = await visits.find({}).toArray();

  res.json(allVisits);
});

//this endpoint return most search keyword as per ascending and descending order if
// we want in ascending order than use http://localhost:3001/most-searched-keywords/asc
// and for descending  http://localhost:3001/most-searched-keywords/descnuse this endpoint
app.get("/most-searched-keywords/:order(asc|desc)", async (req, res) => {
  const { order } = req.params;

  const db = client.db("MiniWiki");
  const searches = db.collection("searchKeyword");

  const result = await searches
    .aggregate([
      { $group: { _id: "$query", count: { $sum: "$count" } } },
      { $project: { keyword: "$_id", count: 1, _id: 0 } }, // Rename _id to keyword
      { $sort: { count: order === "asc" ? 1 : -1 } },
    ])
    .toArray();

  res.json(result);
});

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://wikimedia-raxl.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Origin",
    "https://wikimedia-raxl.vercel.app"
  );

  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
