const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
var currentId = currentId;

app.use(function (req, res, next) {
  if (req.headers["x-forwarded-proto"] === "https") {
    res.redirect("http://" + req.hostname + req.url);
  } else {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static("public"));

app.post("/", function (req, res) {
  console.log("hello");
  var currentId = req.body.currentId;
  console.log(currentId);
  databaseSubmit(currentId);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});

mongoose.connect("mongodb://localhost:27017/gbArchive", {
  useNewUrlParser: true,
});

const archiveSchema = new mongoose.Schema({
  videoId: String,
  videoTitle: String,
  channelId: String,
  channelTitle: String,
  description: String,
  publisheTime: String,
  duration: String,
  thumbnailHigh: String,
  userRating: Number,
});

const Video = mongoose.model("Video", archiveSchema);

function databaseSubmit(currentId) {
  const video = new Video({
    videoId: currentId["id"],
    videoTitle: currentId["snippet"]["title"],
    channelId: currentId["snippet"]["channelId"],
    channelTitle: currentId["snippet"]["channelTitle"],
    description: currentId["snippet"]["description"],
    publisheTime: currentId["snippet"]["publishedAt"],
    duration: currentId["contentDetails"]["duration"],
    thumbnailHigh: currentId["snippet"]["thumbnails"]["high"]["url"],
    userRating: 0,
  });
  video.save();
}

// exports.databaseSubmit = databaseSubmit;
