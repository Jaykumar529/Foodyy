const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  orderId: {
    type: String,
  },
  userName: {
    type: String,
  },
  mailId: {
    type: String,
  },
  deliveryOtp: {
    type: String,
  },
  agentDetails: {
    name: String,
    agentId: String
  },
  Address: {
    type: String,
  },
  restaurantName: {
    type: String,
  },
  restaurantLocation: {
    type: String,
  },
  action: {
    type: String,
    // default: "New",
  },
  OrderedItems: {
    type: Array,
  },
  totalAmount: {
    type: Number,
  },
  PaymentStatus: {
    type: String,
  },
  OrderStatus: {
    type: String,
    default: "New",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const OrderModel = mongoose.model("order", OrderSchema);
module.exports = OrderModel;

 // createdDate: {
  //   type: String,
  //   default: () => new Date().toISOString().split("T")[0], // Stores only the date (YYYY-MM-DD)
  // },
  // createdTime: {
  //   type: String,
  //   default: () => new Date().toLocaleTimeString("en-US", { hour12: false }), // Stores only the time (HH:mm:ss)
  // },
  // Timestamp: