const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (username) {
    const isFound = users.findIndex((user) => user.username == username);
    if (isFound == -1) {
      return true;
    }
  }
  return false;
};

const authenticatedUser = (username, password) => {
  if (username && password) {
    const reqUser = users.find((user) => user.username == username);
    if (reqUser && reqUser.password == password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username,password)) {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    res.status(200).send(`User: ${username} logged in successfully`);
  } else {
    res.status(404).send(`Login Error`);
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book=books[req.params.isbn];
  const username=req.session.authorization["username"];
  const review=req.query.review;
if(book && username && review){
  book.reviews[username]=review;
  res.status(200).send(`Review for ${book.title} successfully Added.`);
}
else{
  res.status(404).send(`Review couldn't be added.`)
}

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
