const express = require("express");
const bodyParser = require("body-parser");
//const db = require("./db");
const mongoose = require("mongoose");
const interviewController = require("./controllers/interviewController");

const app = express();

mongoose.connect("mongodb://localhost/interview-scheduler", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
  //useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/interviews", interviewController.getInterviews);
app.post("/interviews", interviewController.createInterview);
app.get("/interviews/:id/edit", (req, res) => {
  res.render("edit-interview");
});
app.put("/interviews/:id", interviewController.editInterview);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
