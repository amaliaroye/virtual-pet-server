'use strict'
// require mongoose library
const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
  // mongoose adds a _.id property to every schema by default
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  happiness: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  // dob: {
  //   type: Date,
  //   required: true
  // },
  owner: {
    // the pet's ownerId is user._id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  // alive: {
  //   type: Boolean,
  //   default: true,
  //   required: true
  // }
}, { // create data to include when creating an object
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

// Virtual Attributes

// find `age` (in minutes) based on time of birth
// petSchema.virtual('age').get(function () {
//   return Math.floor(Math.abs((Date.now() - this.dob) / 60000))
// })

// if the pet is not assigned an owner, `adopted` = false
// petSchema.virtual('adopted').get(function () {
//   return this.owner !== ''
// })

// mood
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
