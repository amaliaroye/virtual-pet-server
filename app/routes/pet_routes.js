// require necessary NPM packages
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for pet
const Pet = require('../models/pet')

// collection of methods that detects situations when we need to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// middleware that removes blank/undefined fields from req.body
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// create an express instance (mini app that only handles routes)
const router = express.Router()

/*       ___   ___   ___     _     _____   ___
 *      / __| | _ \ | __|   /_\   |_   _| | __|
 *     | (__  |   / | _|   / _ \    | |   | _|
 *      \___| |_|_\ |___| /_/ \_\   |_|   |___|
 */
// POST: /pets
router.post('/pets', requireToken, (req, res, next) => {
  const pet = req.body.pet
  // set owner of new pet to be currently logged-in user
  pet.owner = req.user.id

  // create new pet using `Pet` model
  Pet.create(pet)
    // return 201: Created and new `pet` object
    .then((pet) => { res.status(201).json({ pet }) })
    // if error
    .catch(next)
})

/*      ___   _  _   ___    ___  __  __
 *     |_ _| | \| | |   \  | __| \ \/ /
 *      | |  | .` | | |) | | _|   >  <
 *     |___| |_|\_| |___/  |___| /_/\_\
 */
// GET: /pets (owned by current user)
router.get('/pets', requireToken, (req, res, next) => {
  const owner = req.user
  // search for ALL pets with the user's id as owner
  Pet.find({ owner: owner.id })
    // if no documents are found, return a 404: Not Found error
    .then(handle404)
    // return 200: OK and list all pets owned by the user
    .then((pets) => { res.status(200).json({ pets }) })
    // if error
    .catch(next)
})

/*      ___   _  _    ___   __      __
 *     / __| | || |  / _ \  \ \    / /
 *     \__ \ | __ | | (_) |  \ \/\/ /
 *     |___/ |_||_|  \___/    \_/\_/
 */
// GET: /pets/:id (search for a pet by id)
router.get('/pets/:id', requireToken, (req, res, next) => {
  Pet.findById(req.params.id)
    .then(handle404)
    .then((pet) => { res.status(200).json({ pet }) })
    .catch(next)
})

/*      _   _   ___   ___      _     _____   ___
 *     | | | | | _ \ |   \    /_\   |_   _| | __|
 *     | |_| | |  _/ | |) |  / _ \    | |   | _|
 *      \___/  |_|   |___/  /_/ \_\   |_|   |___|
 */
// PATCH: /pets/:id
router.patch('/pets/:id', requireToken, removeBlanks, (req, res, next) => {
  // set `petData` as the info in the body of the request
  const petData = req.body.pet
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete petData.owner
  Pet.findById(req.params.id)
    .then(handle404)
    .then((pet) => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, pet)
      // pass the result of Mongoose's `.update` to the next `.then`
      return pet.updateOne(petData)
    })
    // return 202: Accepted
    .then(() => { res.sendStatus(204) })
    // if an error occurs, pass it to the handler
    .catch(next)
})

/*      ___    ___   _      ___   _____   ___
 *     |   \  | __| | |    | __| |_   _| | __|
 *     | |) | | _|  | |__  | _|    | |   | _|
 *     |___/  |___| |____| |___|   |_|   |___|
 */
// DELETE: /pets/:id
router.delete('/pets/:id', requireToken, (req, res, next) => {
  Pet.findById(req.params.id)
    .then(handle404)
    .then(pet => {
      requireOwnership(req, pet)
      pet.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router