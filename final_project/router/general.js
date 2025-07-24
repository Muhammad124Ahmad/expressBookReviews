const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const isFound = users.findIndex((user)=>(user.username == username));
    if (isFound == -1) {
      users.push({ username, password });
      res.status(200).send(`User: ${username} created successfully`);
    }
    else{
      res.status(404).send(`User with ${username} username already exists`)
    }
  } else {
    res.status(404).send(`Invalid Username or Password`);
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) {
    res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book) {
    res.status(200).send(book);
  } else {
    res.status(404).send(`Book with ISBN:${ISBN} not found`);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const reqBook = Object.entries(books).filter(
    ([id, book]) => book.author == author
  );

  if (reqBook) {
    res.status(200).send(JSON.stringify(reqBook));
  } else {
    res.status(404).send(`Book with author ${author} not found.`);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const reqBook = Object.entries(books).filter(
    ([id, book]) => book.title == title
  );

  if (reqBook) {
    res.status(200).send(JSON.stringify(reqBook));
  } else {
    res.status(404).send(`Book with author ${author} not found.`);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book) {
    res.status(200).send(book.reviews);
  } else {
    res.status(404).send(`Book with ISBN:${ISBN} not found`);
  }
});

module.exports.general = public_users;
