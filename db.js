const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
  email : {type: String, unique:true},
  password: String,
  name: String
});

const Todo = new Schema({
  userId : ObjectId,
  title : String,
  todostatus : Boolean,
});

const userModel = mongoose.model('users',User);
const todoModel = mongoose.model('todos',Todo);

module.exports = {
   userModel : userModel,
   todoModel : todoModel
}