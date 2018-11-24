const mongoose = require('mongoose')

const user_schema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    unique: true,
    required:true
  },
  password: {
    type: String,
    default: ''
  },
})
module.exports = user_schema