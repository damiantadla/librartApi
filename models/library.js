const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LibrarySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  urlImg: {
    type: String,
    required: true,
  },
  CreateAt: {
    type: Date,
    default: Date.now,
  },
  UpdateAt: {
    type: Date,
    default: Date.now,
  },
});

const Library = mongoose.model("Project", LibrarySchema);

module.exports = Library;
