// var fs = require("fs");
// var text = fs.readFileSync("./fonts.txt");
// var textByLine = Array.from(text);
// console.log(textByLine);

// $(".animation").css("font-family", "arial");

// $(".animation").css("font-family", "arial");

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

// $(".animation").css("font-family", fontArray[4]);

// for (let i = 0; i < fontArray.length; i++) {
//   setTimeout(() => {
//     console.log(i);
//     $(".animation").css("font-family", fontArray[3]);
//   }, 1000);
// }

// function delay(i) {
//   setTimeout(() => {
//     console.log(i);
//     $(".animation").css("font-family", fontArray[i]);
//   }, 1000);
// }
// fs.readFile("fonts.txt", "utf-8", function (err, data) {
//   if (err) throw err;
//   var array = Array.from(data); //convert char array
//   console.log(array);
// });
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

doSomething();
