const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const connection = require("./database/db.js");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", require("./router/userRouter"));

connection();

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
