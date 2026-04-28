const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Use the imported isValid() function
  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  } else {
    return res.status(409).json({ message: "User already exists!" });
  }
});

const axios = require("axios");

public_users.get("/booksdb", (req, res) => {
  res.status(200).json(books);
});

public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/booksdb"); 
    const booksString = JSON.stringify(response.data, null, 2);
    res.status(200).send(booksString);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get("http://localhost:5000/booksdb");
    const book = response.data[isbn];

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const response = await axios.get("http://localhost:5000/booksdb"); // or "/"
    const matchingBooks = Object.values(response.data).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get("http://localhost:5000/booksdb"); // or "/"
    const matchingBooks = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
