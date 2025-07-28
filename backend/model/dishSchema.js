const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DishImageSchema = new Schema({
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
    type: String,
  },
  description: {
    type: String,
  },
  id: {
    type: String,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "resdetails"
  }, // Reference to Restaurant
  price: {
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

const DishImageModel = mongoose.model("dishdetails", DishImageSchema);
module.exports = DishImageModel
