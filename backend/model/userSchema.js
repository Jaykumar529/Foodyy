const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
  userName: {
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

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    
    // this.password =  bcrypt.hash(this.password, 10)
    // next()
    try {
    const hashedPassword = await bcrypt.hash(this.password, 10); // Use await here
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
})

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel;