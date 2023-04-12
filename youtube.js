// import { writefile } from "fs";
// import fetch from "node-fetch";
// globalThis.fetch = fetch;

YOUTUBE_API_KEY = [
  "AIzaSyBesfjYTtAk5vOqCA549-3zr4d4GlCbMvA",
  "AIzaSyBLwGPRTTLqwPu36ArhTCe9wfaASMaFP7g",
  "AIzaSyBbjPfpogUhfCptQKixNdKI445O_XFP3hs",
  "AIzaSyBMOq2KUZg7xFc29bGF9VKQgRHYMEX7tpQ",
  "AIzaSyBBFpmVkJLy-5iy-4nMGjlzEZWoAfziuuU",
  "AIzaSyDBxVN6Jb3pYqPfsOM9NdgzItzivNX27QI",
];
// if (!YOUTUBE_API_KEY) {
//   throw new Error("No API Key is provided");
// }

//Verify that the video title contains the search query

// function scrub(data) {
//     for (i=0; i < data.items.length; i++) {
//         if (data.items[i].)
//     }
// }
var currentId;

$(document).ready(() => {
  startup();
});

$("#refresh").on("click", () => {
  refresh();
});

$("#pause").on("click", () => {
  player.pauseVideo();
});

$("#play").on("click", () => {
  player.playVideo();
});
// KEY CONTROLS FOR PLAYER

$("#play").on("keydown", (event) => {
  if (event.key === "s") {
    console.log("hello");
  }
});

// ADD VIDEO ID TO ARCHIVE ON BUTTON CLICK
// $("#archive").on("click", () => {
//   writefile("archive.txt", "currentId" + currentId, (err) => {
//     if (err) throw err;
//   });
// });

async function apiRequest(query) {
  console.log("1");
  videoData = [];
  console.log("ready");
  //API request
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY[1]}&type=video&videoDuration=short&videoEmbeddable=true&maxResults=100&videoDefinition=high&q=${query}`;
  const response = await fetch(url);
  console.log("2");
  const data = await response.json();
  console.log("3");
  console.log(data);
  //Sends result data to embed function to be processed
  //   console.log(data);
  videoIdList = "";
  //   console.log(data.items.length);
  for (let i = 0; i < data.items.length; i++) {
    if (i == data.items.length - 1) {
      videoIdList += data.items[i]["id"]["videoId"];
    } else {
      videoIdList += data.items[i]["id"]["videoId"] + "%2C";
    }
  }
  console.log(videoIdList);
  return videoIdList;

  //   return randomId(data);
}

async function apiContentDetails(videoIdList) {
  videoContentDetails = [];
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdList}&part=contentDetails&key=${YOUTUBE_API_KEY[1]}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
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
      rel: 0,
      autoplay: 1,
      modestbranding: 1,
      controls: 0,
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
  vidDetails = videoContentDetails.items;
  filteredVideoIdList = [];
  console.log("entered filter function");
  //   console.log(videoContentDetails.items[0]["contentDetails"]["duration"]);
  for (let i = 0; i < vidDetails.length; i++) {
    if (vidDetails[i]["contentDetails"]["duration"] < "PT1M0S") {
      filteredVideoIdList.push(vidDetails[i]["id"]);
    }
  }
  return filteredVideoIdList;
}
//GENERATES RANDOM ID FROM VIDEO DATA
function randomId(dataValue) {
  var embedId = dataValue.items[0]["id"]["videoId"];
  console.log(dataValue.items);
  currentId = embedId;
  return embedId;
  //   var url = `https://www.youtube.com/embed/${videoId}?&autoplay=1`;
  //   console.log(url);
  //   $("#youtube").attr("src", url);
}

// CUES VIDEO
function cueVideo(id) {
  player.loadVideoById({ videoId: id });
}

// number = query();
// chosenVideo = apiRequest(number);
// onYouTubeIframeAPIReady(chosenVideo);
// cueVideo("QPjHCAHfjoU&t");
// apiRequest("img 2182");

async function startup() {
  var queryValue = query();
  var videoIdList = await apiRequest(queryValue);
  var videoContentDetails = await apiContentDetails(videoIdList);
  var videoIdListFinal = await durationNameFilter(videoContentDetails);

  var randomId = await videoIdListFinal[
    Math.floor(Math.random() * videoIdListFinal.length + 1)
  ];
  console.log(randomId);

  ytPlayer(randomId);
  //   console.log(videoContentDetails);

  //   console.log(videoId);
  //   ytPlayer(videoId);
}

async function refresh() {
  var queryValue = query();
  var videoIdList = await apiRequest(queryValue);
  var videoContentDetails = await apiContentDetails(videoIdList);
  var videoIdListFinal = await durationNameFilter(videoContentDetails);

  var randomId = await videoIdListFinal[
    Math.floor(Math.random() * videoIdListFinal.length + 1)
  ];
  console.log(randomId);

  cueVideo(randomId);
}
