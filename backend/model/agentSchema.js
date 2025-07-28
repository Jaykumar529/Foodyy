const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const AgentSchema = new Schema({
  agentName: {
    type: String,
  },
  mailId: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});

AgentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    try {
    const hashedPassword = await bcrypt.hash(this.password, 10); // Use await here
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
})

AgentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AgentModel = mongoose.model("agents", AgentSchema)
module.exports = AgentModel;