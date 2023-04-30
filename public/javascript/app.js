// import { databaseSubmit } from ("./server.cjs");
//API KEY REFERENCE LIST
// const YOUTUBE_API_KEY = [
//   "AIzaSyBesfjYTtAk5vOqCA549-3zr4d4GlCbMvA",
//   "AIzaSyBLwGPRTTLqwPu36ArhTCe9wfaASMaFP7g",
//   "AIzaSyBbjPfpogUhfCptQKixNdKI445O_XFP3hs",
//   "AIzaSyBMOq2KUZg7xFc29bGF9VKQgRHYMEX7tpQ",
//   "AIzaSyBBFpmVkJLy-5iy-4nMGjlzEZWoAfziuuU",
//   "AIzaSyDBxVN6Jb3pYqPfsOM9NdgzItzivNX27QI",
// ];

const list = [
  "Helvetica",
  "Arial",
  "Verdana",
  "Tahoma",
  "Trebuchet",
  "Impact",
  "Gill Sans",
  "Times New Roman",
  "Georgia",
  "Palatino",
  "Baskerville",
  "Andalé Mono",
  "Courier",
  "Lucida",
  "Monaco",
  "Bradley",
  "Brush Script",
  "Luminari",
  "Comic Sans",
];

const languageList = [
  "bilanc grafik",
  "grafískt jafnvægi",
  "equilibrio grafico",
  "графический баланс",
  "グラフィックバランス",
  "grafisk balans",
  "grafische balans",
  "גראַפיק וואָג",
  "გრაფიკული ბალანსი",
  "graphic na balanse",
  "grafické vyvážení",
  "ku ringanisela ka swifaniso",
];

// const API_INDEX = 4;
var apiKey = sessionStorage.getItem("apiKey");

var currentId;
// export var currentId;
var nextId;
// var watchHistory = [];

var timeInterval = sessionStorage.getItem("timeInterval");

// STARUP FUNCTION ON DOM INITIALIZATION
$(document).ready(() => {
  //CODE FOR HOME PAGE INITIALIZATION
  if ($("body").data("title") === "index") {
    if (!sessionStorage.getItem("watchHistory")) {
      sessionStorage.setItem("watchHistory", JSON.stringify([]));
    }
    sessionStorage.setItem("timeInterval", "any");
    startup();
    var header = Math.floor(Math.random() * languageList.length);
    $("#header").html(languageList[header]);
    //CODE FOR SPLASH PAGE INITIALIZATION
  } else if ($("body").data("title") === "splash") {
    doSomething();
    $("#apiKeyForm").on("submit", function (e) {
      e.preventDefault();
      var apiKeyInput = $("#apiKeyForm :input").val();
      if (apiKeyInput.length == 39) {
        sessionStorage.setItem("apiKey", apiKeyInput);
        alert("api key accepted");
      } else {
        alert("invalid api key");
      }
    });
  }
});

//NEXT BUTTON
$("#refresh").on("click", () => {
  var watchHistory = JSON.parse(sessionStorage.getItem("watchHistory")) || [];
  var nextIdIndex = watchHistory.findIndex((x) => x.id === currentId["id"]) + 1;
  if (nextIdIndex >= watchHistory.length - 1) {
    refresh();
    console.log(
      "time interval from refresh tab: " + sessionStorage.timeInterval
    );
  } else {
    currentId = watchHistory[nextIdIndex];
    cueVideo(watchHistory[nextIdIndex]["id"]);
  }
});

//PREVIOUS BUTTON
$("#previous").on("click", () => {
  var watchHistory = JSON.parse(sessionStorage.getItem("watchHistory")) || [];
  var previousIdIndex =
    watchHistory.findIndex((x) => x.id === currentId["id"]) - 1;
  if (previousIdIndex >= 0) {
    currentId = watchHistory[previousIdIndex];
    cueVideo(watchHistory[previousIdIndex]["id"]);
  } else {
    // do nothing
  }
});

//PAUSE BUTTON
$("#pause").on("click", () => {
  player.pauseVideo();
});

//PLAY BUTTON
$("#play").on("click", () => {
  player.playVideo();
});

$("#durationRadio").on("change", async () => {
  var duration = $("input[type='radio'][name='videoLength']:checked").val();
  sessionStorage.timeInterval = duration;
  removeWatchHIstory();
  nextId = await fetchVideoId();
});

$("#archive").on("click", (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/",
    data: {
      currentId: currentId,
    },
    success: function (result) {
      alert(result);
    },
    error: function (result) {
      alert(result);
    },
  });
});

$(window).bind("beforeunload", function () {
  removeWatchHIstory();
});
// GENERATES TEXT FOR SEARCH QUERY
function query() {
  // Generates number between 0 and 9999 randomly
  var number = Math.floor(Math.random() * 10000).toString();
  //Prepends zeroes to generated number ensuring final value is 4 char in length
  if (number.length == 4) {
    console.log("IMG " + number);
    //Prepends file format string
    return "IMG " + number;
  } else {
    var numLen = 4 - number.length;
    for (let i = 0; i < numLen; i++) {
      number = "0" + number;
    }
    console.log("IMG " + number);
    //Prepends file format string
    return "IMG " + number;
  }
}

// INITIAL API SEARCH REQUEST
async function apiRequest(query) {
  console.log("1");
  console.log("ready");
  // console.log(YOUTUBE_API_KEY);
  console.log("time interval: " + sessionStorage.timeInterval);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&type=video&videoDuration=${sessionStorage.timeInterval}&videoEmbeddable=true&maxResults=100&videoDefinition=high&q=${query}`;
  const response = await fetch(url);
  console.log("2");
  const data = await response.json();
  console.log("3");
  console.log(data);
  return data;
}

// SECONDARY API REQUEST RETURNING CONTENT DETAILS
async function apiContentDetails(data) {
  var videoIdList = "";
  for (let i = 0; i < data.items.length; i++) {
    if (i == data.items.length - 1) {
      videoIdList += data.items[i]["id"]["videoId"];
    } else {
      videoIdList += data.items[i]["id"]["videoId"] + "%2C";
    }
  }
  console.log(videoIdList);
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdList}&part=contentDetails&key=${apiKey}`;
  const response = await fetch(url);
  const contentData = await response.json();
  console.log(contentData);
  // console.log(data.items[1]["snippet"]);
  for (let i = 0; i < contentData.items.length - 1; i++) {
    contentData.items[i]["snippet"] = data.items[i]["snippet"];
  }
  console.log(contentData.items[4]["snippet"]);
  return contentData;
}

// LOOPS THROUGH API RESPONSE AND FILTERS VIDEO ID BY RELEVANT DURATION AND NAME
function durationNameFilter(videoContentDetails, queryValue) {
  var x = 0;
  var filteredList = {};
  // var ptTimeInterval = "PT" + timeInterval + "M0S";
  // console.log(timeInterval);
  console.log("entered filter function");
  console.log(
    "video content details length " + videoContentDetails.items.length
  );
  for (let i = 0; i < videoContentDetails.items.length - 1; i++) {
    if (videoContentDetails.items[i]["snippet"]["title"] === queryValue) {
      filteredList[x] = videoContentDetails.items[i];
      // console.log("video is too long");
      x += 1;
    }
  }
  console.log(filteredList);
  return filteredList;
}

// YOUTUBE IFRAME CONSTRUCTOR
var player;
var ytPlayer = function onYouTubeIframeAPIReady(id) {
  console.log("The new id is" + id);
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
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
    var watchHistory = JSON.parse(sessionStorage.getItem("watchHistory")) || [];
    var nextIdIndex =
      watchHistory.findIndex((x) => x.id === currentId["id"]) + 1;
    if (nextIdIndex >= watchHistory.length - 1) {
      refresh();
      console.log(
        "time interval from refresh tab: " + sessionStorage.timeInterval
      );
    } else {
      currentId = watchHistory[nextIdIndex];
      cueVideo(watchHistory[nextIdIndex]["id"]);
    }
  }
}

// CUES VIDEO TO IFRAME
function cueVideo(id) {
  player.loadVideoById({ videoId: id });
}

// BUNDLED QUERY AND AND RANDOM ID GENERATION
async function fetchVideoId() {
  while (true) {
    var queryValue = query();
    var videoQueryData = await apiRequest(queryValue);
    var videoContentDetails = await apiContentDetails(videoQueryData);
    var videoIdListFinal = durationNameFilter(videoContentDetails, queryValue);
    console.log(
      "video id list final length " + Object.keys(videoIdListFinal).length
    );
    if (Object.keys(videoIdListFinal).length > 1) {
      var randNumber = Math.floor(
        Math.random() * Object.keys(videoIdListFinal).length
      );
      saveWatchHistory(videoIdListFinal[randNumber]);
      // watchHistory.push(videoIdListFinal[randNumber]);
      // console.log("watch history item " + watchHistory[0]["id"]);
      // console.log(videoIdListFinal[randNumber]);
      return videoIdListFinal[randNumber];
    }
  }
}

//INITIAL QUERY AND CUE QUERY TO BE RUN AT STARTUP
async function startup() {
  var randomId = await fetchVideoId();
  ytPlayer(randomId["id"]);
  currentId = randomId;
  console.log("current ID" + currentId["id"]);
  console.log("random id selected from startup function: " + randomId);
  nextId = await fetchVideoId();
}

//REFRESH QUERY AND QUE QUERY
async function refresh() {
  cueVideo(nextId["id"]);
  currentId = nextId;
  console.log("refresh video cued");
  nextId = await fetchVideoId();
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const doSomething = async () => {
  while (true) {
    for (let i = 0; i < list.length; i++) {
      await sleep(100);
      $(".animation").css("font-family", list[i]);
    }
  }
};

function saveWatchHistory(data) {
  var watchHistory = [];
  watchHistory = JSON.parse(sessionStorage.getItem("watchHistory")) || [];
  watchHistory.push(data);
  sessionStorage.setItem("watchHistory", JSON.stringify(watchHistory));
}

function removeWatchHIstory() {
  var watchHistory = [];
  watchHistory = JSON.parse(sessionStorage.getItem("watchHistory")) || [];
  watchHistory.pop();
  sessionStorage.setItem("watchHistory", JSON.stringify(watchHistory));
}
