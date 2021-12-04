const express = require("express");
const newConnection = require("./connect_db");
const path = require("path");

const app = express();
const port = 80;


app.listen(port, () => console.log(`Server is listening on port ${port}`))