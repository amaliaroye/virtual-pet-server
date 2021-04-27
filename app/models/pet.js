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

// petSchema.virtual('mood').get(function () {
//   if (this.happiness > 80) {
//     return 'happy'
//   } else if (this.happiness > 60) {
//     return 'content'
//   } else if (this.happiness > 40) {
//     return 'neutral'
//   } else if (this.happiness > 20) {
//     return 'tense'
//   } else if (this.happiness > 0) {
//     return 'sad'
//   }
// })

module.exports = mongoose.model('Pet', petSchema)
