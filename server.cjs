const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
// var currentId = currentId;
app.set("view engine", "ejs");
//EXPRESS SERVER INITIALIZATION
app.use(function (req, res, next) {
  if (req.headers["x-forwarded-proto"] === "https") {
    res.redirect("http://" + req.hostname + req.url);
  } else {
    next();
  }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use(express.static("public"));

//HOME PAGE
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//ARCHIVE DATABASE RETRIEVAL AND EJS REFERENCE
app.get("/archive", async (req, res) => {
  var foundItems = await getDatabaseItems();
  res.render("index", { foundItems: foundItems });
});

// POST DATA TO DATABASE ON CLICK ARCHIVE BUTTON
app.post("/", function (req, res) {
  var currentId = req.body.currentId;
  databaseSubmit(currentId, res);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});

// CONNECT TO MONGODB DATABASE
mongoose.connect("mongodb://localhost:27017/gbArchive", {
  useNewUrlParser: true,
});

// SCHEMA FOR VIDEO ARCHIVE ELEMENTS
const archiveSchema = new mongoose.Schema({
  _id: String,
  videoTitle: String,
  channelId: String,
  channelTitle: String,
  description: String,
  publisheTime: String,
  duration: String,
  thumbnailHigh: String,
  userRating: Number,
});

//VIDEO OBJECT MODEL
const Video = mongoose.model("Video", archiveSchema);

// FUNCTION CREATES NEW VIDEO ITEM AND SUBMITS TO THE DATABASE
// ERROR CATCHING IMPLEMENTED TO PREVENT DUPLICATE ENTRIES
// ERROR MESSAGE IS CURRENTLY NOT BEING DISPLAYED
async function databaseSubmit(currentId, res) {
  console.log(currentId);
  const video = new Video({
    _id: currentId["id"],
    videoTitle: currentId["snippet"]["title"],
    channelId: currentId["snippet"]["channelId"],
    channelTitle: currentId["snippet"]["channelTitle"],
    description: currentId["snippet"]["description"],
    publisheTime: currentId["snippet"]["publishedAt"],
    duration: currentId["contentDetails"]["duration"],
    thumbnailHigh: currentId["snippet"]["thumbnails"]["high"]["url"],
    userRating: 0,
  });

  try {
    await video.save();
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res.status(422).json({
        message: "This video has already been submitted to the Archive",
      });
    }
  }
}

async function getDatabaseItems() {
  const items = await Video.find({});
  return items;
}

// function archivePopulate() {}
