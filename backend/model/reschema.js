const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResImageSchema = new Schema({
  imageURL: {
    type: String,
  },
  imgId: {
    type: String,
  },
  name: {
    type: String,
  },
  star: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ResImageModel = mongoose.model("resdetails", ResImageSchema);
module.exports = ResImageModel
