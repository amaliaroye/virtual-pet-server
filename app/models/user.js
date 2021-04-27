'use strict'
// require mongoose library
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // mongoose adds a _.id property to every schema by default
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  token: {
    type: String
  }
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
