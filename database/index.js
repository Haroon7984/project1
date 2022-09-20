var mongoose = require('mongoose');

const url = "mongodb+srv://dbUser:mR2Qsk2WVrpK7pzT@cluster0.spzpu.mongodb.net/myOwnToDoList?retryWrites=true&w=majority"

module.exports.start = function()
{
  mongoose.connect(url).then(function()
  {
    console.log("db is live")
  })
}