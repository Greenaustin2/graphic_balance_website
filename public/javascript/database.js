import { mongoose } from "mongoose";
// const { connect, Schema, model } = mongoose;

// import { currentId } from "./app.js";
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

// const video = new Video({
//   videoId: "mrdX-ROaX0o",
//   channelId: "",
//   title: "5/8 Drum Solo",
//   rating: 2,
// });

const video = new Video({
  videoId: "hello",
});
video.save();

// export function databaseSubmit(currentId) {
//   const video = new Video({
//     videoId: currentId["id"],
//     videoTitle: currentId["snippet"]["title"],
//     channelId: currentId["snippet"]["channelId"],
//     channelTitle: currentId["snippet"]["channelTitle"],
//     description: currentId["snippet"]["description"],
//     publisheTime: currentId["snippet"]["publishedAt"],
//     duration: currentId["contentDetails"]["duration"],
//     thumbnailHigh: currentId["snippet"]["thumbnail"]["high"]["url"],
//     userRating: 0,
//   });
//   video.save();
// }
// const userSchema = new Schema({
//   name: String,
//   email: String,
//   Password: String,
//   favorites: [
//     {
//       videoId: String,
//       title: String,
//       rating: Number,
//     },
//   ],
// });

// const User = model("User", userSchema);

// const user = new User({
//   name: "Austin Green",
//   email: "greenaustin2@gmail.com",
//   password: "Gr33nie1",
//   favorites: [
//     {
//       videoId: "mrdX-ROaX0o",
//       title: "5/8 Drum Solo",
//       rating: 2,
//     },
//   ],
// });

// user.save();
