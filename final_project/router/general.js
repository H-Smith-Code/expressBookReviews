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

// Define a GET route at /isbn/:isbn
public_users.get("/isbn/:isbn", async (req, res) => {
  // Extract the ISBN parameter from the request URL
  const isbn = req.params.isbn;

  try {
    // Make an HTTP GET request to another route (/booksdb) to fetch all books
    // Axios returns a promise, so we use await to pause until the response arrives
    const response = await axios.get("http://localhost:5000/booksdb");

    // Look up the book in the returned data using the ISBN as the key
    const book = response.data[isbn];

    // If the book exists, return it with HTTP status 200 (OK)
    if (book) {
      res.status(200).json(book);
    } else {
      // If no book matches the ISBN, return a 404 (Not Found) with a message
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // If Axios fails (e.g., /booksdb route missing, server error, network issue),
    // log the error message to the server console for debugging
    console.error("Error fetching book:", error.message);

    // Return a 500 (Internal Server Error) response to the client
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

// Define a GET route at /title/:title
public_users.get("/title/:title", async (req, res) => {
  // Extract the title parameter from the request URL
  const title = req.params.title;

  try {
    // Make an HTTP GET request to another route (/booksdb) to fetch all books
    // Axios returns a promise, so we use await to pause until the response arrives
    const response = await axios.get("http://localhost:5000/booksdb"); // or "/"

    // Convert the response object into an array of book objects
    // Then filter the array to only include books whose title matches the requested title (case-insensitive)
    const matchingBooks = Object.values(response.data).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    // If one or more books match, return them with HTTP status 200 (OK)
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      // If no books match, return a 404 (Not Found) with a message
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    // If Axios fails (e.g., /booksdb route missing, server error, network issue),
    // log the error message to the server console for debugging
    console.error("Error fetching books:", error.message);

    // Return a 500 (Internal Server Error) response to the client
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
