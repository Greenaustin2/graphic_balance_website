// import * as fs from "fs";
// import { YOUTUBE_API_KEY } from "./config";
// import { writeToArchive } from "./script.js";
//jshint esversion:6

// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/gbArchive");

const YOUTUBE_API_KEY = [
  "AIzaSyBesfjYTtAk5vOqCA549-3zr4d4GlCbMvA",
  "AIzaSyBLwGPRTTLqwPu36ArhTCe9wfaASMaFP7g",
  "AIzaSyBbjPfpogUhfCptQKixNdKI445O_XFP3hs",
  "AIzaSyBMOq2KUZg7xFc29bGF9VKQgRHYMEX7tpQ",
  "AIzaSyBBFpmVkJLy-5iy-4nMGjlzEZWoAfziuuU",
  "AIzaSyDBxVN6Jb3pYqPfsOM9NdgzItzivNX27QI",
];

const API_INDEX = 4;

var currentId;
var nextId;
var watchHistory = [];

// DOM BUTTON CONTROLS
$(document).ready(() => {
  startup();
});

$("#refresh").on("click", () => {
  var nextIdIndex = watchHistory.findIndex((x) => x.id === currentId) + 1;
  if (nextIdIndex >= watchHistory.length - 1) {
    refresh();
  } else {
    currentId = watchHistory[nextIdIndex]["id"];
    cueVideo(watchHistory[nextIdIndex]["id"]);
  }
});

$("#previous").on("click", () => {
  var previousIdIndex = watchHistory.findIndex((x) => x.id === currentId) - 1;
  if (previousIdIndex >= 0) {
    currentId = watchHistory[previousIdIndex]["id"];
    cueVideo(watchHistory[previousIdIndex]["id"]);
  } else {
    // do nothing
  }
});

$("#pause").on("click", () => {
  player.pauseVideo();
});

$("#play").on("click", () => {
  player.playVideo();
});
// KEY CONTROLS FOR PLAYER

// $("#archive").on("click", () => {
//   writeToArchive(currentId);
// });
// ADD VIDEO ID TO ARCHIVE ON BUTTON CLICK
// $("#archive").on("click", () => {
//   fs.writefile("./archive.txt", "currentId" + currentId, (err) => {
//     if (err) throw err;
//   });
// });

async function apiRequest(query) {
  console.log("1");
  videoData = [];
  console.log("ready");
  //API request
  console.log(YOUTUBE_API_KEY);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY[4]}&type=video&videoDuration=short&videoEmbeddable=true&maxResults=100&videoDefinition=high&q=${query}`;
  const response = await fetch(url);
  console.log("2");
  const data = await response.json();
  console.log("3");
  console.log(data);
  return data;
}

async function apiContentDetails(data) {
  videoIdList = "";
  for (let i = 0; i < data.items.length; i++) {
    if (i == data.items.length - 1) {
      videoIdList += data.items[i]["id"]["videoId"];
    } else {
      videoIdList += data.items[i]["id"]["videoId"] + "%2C";
    }
  }
  console.log(videoIdList);
  // return videoIdList;
  // videoContentDetails = [];
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdList}&part=contentDetails&key=${YOUTUBE_API_KEY[4]}`;
  const response = await fetch(url);
  const contentData = await response.json();
  console.log(contentData);
  // console.log(data.items[1]["snippet"]);
  for (let i = 0; i < contentData.items.length - 1; i++) {
    contentData.items[i]["snippet"] = data.items[i]["snippet"];
  }
  // console.log("content data merged" + contentData);

  return contentData;
}

// YOUTUBE IFRAME CONSTRUCTOR
var player;
var ytPlayer = function onYouTubeIframeAPIReady(id) {
  console.log("The new id is" + id);
  player = new YT.Player("player", {
    height: "609",
    width: "1000",
    videoId: id,
    playerVars: {
      playsInline: 1,
      rel: 0,
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      color: "white",
      fs: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerReady(event) {
  event.target.playVideo();
}
var done = false;
function onPlayerStateChange(event) {
  if (event.data === 0) {
    refresh();
  }
}

// GENERATES TEXT FOR SEARCH QUERY
function query() {
  // Generates number between 0 and 9999 randomly
  number = Math.floor(Math.random() * 10000).toString();
  //Prepends zeroes to generated number ensuring final value is 4 char in length
  if (number.length == 4) {
    console.log("IMG " + number);
    //Prepends file format string
    return "IMG " + number;
  } else {
    numLen = 4 - number.length;
    for (let i = 0; i < numLen; i++) {
      number = "0" + number;
    }
    console.log("IMG " + number);
    //Prepends file format string
    return "IMG " + number;
  }
}

// LOOPS THROUGH API RESPONSE AND FILTERS VIDEO ID BY RELEVANT DURATION AND NAME
function durationNameFilter(videoContentDetails) {
  // vidDetails = videoContentDetails.items;
  var x = 0;
  var filteredList = {};
  // filteredVideoIdList = [];
  console.log("entered filter function");
  //   console.log(videoContentDetails.items[0]["contentDetails"]["duration"]);
  for (let i = 0; i < videoContentDetails.items.length; i++) {
    if (videoContentDetails.items[i]["contentDetails"]["duration"] < "PT1M0S") {
      filteredList[x] = videoContentDetails.items[i];
      console.log("video is too long");
      x += 1;
      // delete videoContentDetails.items[i];
    }
  }
  console.log(filteredList);
  return filteredList;
}

// CUES VIDEO
function cueVideo(id) {
  player.loadVideoById({ videoId: id });
}

async function fetchVideoId() {
  while (true) {
    var queryValue = query();
    var videoQueryData = await apiRequest(queryValue);
    var videoContentDetails = await apiContentDetails(videoQueryData);
    var videoIdListFinal = await durationNameFilter(videoContentDetails);
    if (Object.keys(videoIdListFinal).length > 1) {
      var randNumber = Math.floor(
        Math.random() * Object.keys(videoIdListFinal).length
      );
      watchHistory.push(videoIdListFinal[randNumber]);
      console.log("watch history item " + watchHistory[0]["id"]);
      console.log(videoIdListFinal[randNumber]);
      return videoIdListFinal[randNumber];
    }
  }
}

async function startup() {
  randomId = await fetchVideoId();
  ytPlayer(randomId["id"]);
  currentId = randomId["id"];
  console.log("random id selected from startup function: " + randomId);
  nextId = await fetchVideoId();
}

async function refresh() {
  cueVideo(nextId["id"]);
  currentId = nextId["id"];
  console.log("refresh video cued");
  nextId = await fetchVideoId();
}
