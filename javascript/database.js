// jshint esversion:6

import { connect, Schema, model } from "mongoose";

connect("mongodb://localhost:27017/gbArchive", {
  useNewUrlParser: true,
});

const archiveSchema = new Schema({
  videoId: String,
  title: String,
  rating: Number,
});

const Video = model("Video", archiveSchema);

const video = new Video({
  videoId: "mrdX-ROaX0o",
  title: "5/8 Drum Solo",
  rating: 2,
});

// video.save();

const userSchema = new Schema({
  name: String,
  email: String,
  Password: String,
  favorites: [
    {
      videoId: String,
      title: String,
      rating: Number,
    },
  ],
});

const User = model("User", userSchema);

const user = new User({
  name: "Austin Green",
  email: "greenaustin2@gmail.com",
  password: "Gr33nie1",
  favorites: [
    {
      videoId: "mrdX-ROaX0o",
      title: "5/8 Drum Solo",
      rating: 2,
    },
  ],
});

user.save();
