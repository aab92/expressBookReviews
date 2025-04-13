const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  user = users.filter((user) => { return user.username == username });
  return user.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  user = users.filter((user) => { return user.username == username && user.password == password });
  return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(400).json({message: "User not registered."});
  }
  // create a JWT and save it to the session object
  // Generate JWT access token
  let accessToken = jwt.sign({
      data: password,
      name: username
  }, 'access', { expiresIn: 60 * 20 });
  // Store access token and username in session
  req.session.authorization = {
      accessToken, username
  }
  return res.status(200).send(`User ${username} successfully logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.name;
  const review = req.query.review;
  const isbn = parseInt(req.params.isbn);
  if (isbn in books) {
    // if user already posted a review for this isbn replace, otherwise add it
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: `Added review for user ${username}`});
  } else {
    return res.status(204).json({message: "isbn not found."});
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
