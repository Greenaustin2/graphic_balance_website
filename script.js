import fs from "fs";
// fs.writeFile("archive.txt");

export function writeToArchive(currentVideoId) {
  fs.writeFile("archive.txt", currentVideoId, (err) => {
    if (err) throw err;
  });
}

// document.getElementById("refresh").addEventListener(
//   "click",
//   function () {
//     alert("hello");
//   },
//   false
// );
