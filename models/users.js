var mongoose = require("mongoose"),
   passportLocalMongoose = require("passport-local-mongoose");

var usersSchema = new mongoose.Schema({
   firstname:String,
   lastname:String,
   email:String,
   username:String,
   password:String,
   role:{ type:String, default:"basic"},
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("users",usersSchema);
