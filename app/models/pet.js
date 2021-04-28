'use strict'
// require mongoose library
const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  // mongoose adds a _.id: {ObjectId} property to every schema by default
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    lowercase: true,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  happiness: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  }
}, { // create data to include when creating an object
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

module.exports = mongoose.model('Pet', petSchema)
