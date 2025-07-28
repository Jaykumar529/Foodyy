const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  imageURL: {
    type: String,
  },
  imgId: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String
  },
  price: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ImageModel = mongoose.model("details", ImageSchema);
module.exports = ImageModel;
