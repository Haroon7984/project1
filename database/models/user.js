var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  age:{
    type: Number,
    default: 10
  }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;