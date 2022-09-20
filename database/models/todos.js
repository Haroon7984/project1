var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt:{
    type: Number,
    required: true,
    default: Date.now
  },
  createdBy:{
    type: String,
    required: true
  }
});

const todoModel = mongoose.model('todo', todoSchema);

module.exports = todoModel;

