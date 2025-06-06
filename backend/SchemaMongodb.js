const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,    // Removes extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,   // converts email to lowercase
  },
  password: {
    type: String,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.model("User", userSchema);    // model is used to connect schema to mongodb database

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  // likes: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }],
  comments: [{
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'archived'],   // 👈 Only these values are allowed in the string
    default: 'active'
  }
}, { timestamps: true });

const Thread = mongoose.model("Thread", threadSchema);

module.exports = { User, Thread };