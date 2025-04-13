const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if( username == "" || password == "") {
    return res.status(400).json({message: "Please provide username and password."});
  }
  if (!isValid(username)) {
    return res.status(400).json({message: "User already registered."});
  }
  users.push({"username": username, "password": password});
  return res.status(200).json({message: `User ${username} succesfully registered. You can login now.`});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //return res.status(200).send(JSON.stringify(books, null, 4));
  await getBooksAsync(req, res);
});

async function getBooksAsync(req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error("some error ocurred in getBooksAsync", error);
  }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  await getBooksISBNAsync(req, res);
});

async function getBooksISBNAsync(req, res) {
 try {
  const isbn = parseInt(req.params.isbn);
  if (isbn in books) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(204).json({message: "isbn not found."});
  }
  } catch (error) {
    console.error("some error ocurred in getBooksISBNAsync", error);
  }
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  await getBooksAuthorAsync(req, res);
});

async function getBooksAuthorAsync(req, res) {
  try {
    let aubo = {}
    const author = req.params.author;
    for (let isbn in books) {
      if (books[isbn].author === author) {
        aubo[isbn] = books[isbn];
      }
    }
    return res.status(200).send(JSON.stringify(aubo, null, 4));
  } catch (error) {
    console.error("some error ocurred in getBooksAuthorAsync", error);
  }
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  await getBooksTitleAsync(req, res);
});

async function getBooksTitleAsync(req, res) {
  try {
    let titbo = {}
    const title = req.params.title;
    for (let isbn in books) {
      if (books[isbn].title === title) {
        titbo[isbn] = books[isbn];
      }
    }
    return res.status(200).send(JSON.stringify(titbo, null, 4));
  } catch (error) {
    console.error("some error ocurred in getBooksTitleAsync", error);
  }
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (isbn in books) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(204).json({message: "isbn not found."});
  }
});

module.exports.general = public_users;
