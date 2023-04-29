const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const date = Date();
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

//HOME PAGE
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/splash.html");
});

// app.get("/index", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

//ARCHIVE DATABASE RETRIEVAL AND EJS REFERENCE
app.get("/archive", async (req, res) => {
  var foundItems = await getDatabaseItems();
  res.render("index", { foundItems: foundItems });
});

app.get("/index", function (req, res) {
  console.log("api key");
  res.sendFile(__dirname + "/index.html");
});
// POST DATA TO DATABASE ON CLICK ARCHIVE BUTTON
app.post("/", function (req, res) {
  var currentId = req.body.currentId;
  databaseSubmit(currentId, res);
});

app.post("/delete", function (req, res) {
  var videoId = req.body.videoId;
  databaseDelete(videoId);
  res.redirect(req.get("referer"));
});

// app.upvote("/upvote", function (req, res) {});

app.post("/index", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});

app.use(express.static(__dirname));
app.use(express.static("public"));

// CONNECT TO MONGODB DATABASE
mongoose.connect(
  "mongodb+srv://greenaustin2:Gr33nie1@gbarchive.ctvmr.mongodb.net/gbArchive",
  {
    useNewUrlParser: true,
  }
);

// SCHEMA FOR VIDEO ARCHIVE ELEMENTS
const archiveSchema = new mongoose.Schema({
  _id: String,
  videoTitle: String,
  channelId: String,
  channelTitle: String,
  description: String,
  publisheTime: String,
  dateAdded: String,
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
    dateAdded: date,
    duration: currentId["contentDetails"]["duration"],
    thumbnailHigh: currentId["snippet"]["thumbnails"]["high"]["url"],
    userRating: 0,
  });

  try {
    await video.save();
    alert("submission succesful");
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

async function databaseDelete(videoId) {
  await Video.deleteOne({ _id: videoId });
  console.log("video deleted");
}

async function upvote(videoId) {}
// function archivePopulate() {}
