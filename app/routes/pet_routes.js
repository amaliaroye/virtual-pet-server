// require necessary NPM packages
const express = require('express')
const passport = require('passport')

const Pet = require('../models/pet')

// collection of methods that detect when a custom error should be thrown
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

/*
 * ---------------------------------------------------- [ C R E A T E ] --------
 * POST : /pets
 */
router.post('/pets', requireToken, (req, res, next) => {
  const pet = req.body.pet
  // set the owner of new pet to be the user that is currently signed-in
  pet.owner = req.user.id

  // create new pet using `Pet` model
  Pet.create(pet)
    // return 201: Created and new `pet` object
    .then((pet) => { res.status(201).json({ pet }) })
    // if error
    .catch(next)
})

/*
 * ------------------------------------------------------ [ I N D E X ] --------
 * GET : /pets
 */
router.get('/pets', requireToken, (req, res, next) => {
  const owner = req.user
  // search for ALL pets with the user's id as owner
  Pet.find({ owner: owner.id })
    // if no documents are found, return a 404: Not Found error
    .then(handle404)
    // return 200: OK and list ALL pets owned by the user
    .then((pets) => { res.status(200).json({ pets }) })
    // if error
    .catch(next)
})

/*
 * -------------------------------------------------------- [ S H O W ] --------
 * GET : /pets/:id
 */
router.get('/pets/:id', requireToken, (req, res, next) => {
  Pet.findById(req.params.id)
    .then(handle404)
    .then((pet) => { res.status(200).json({ pet }) })
    .catch(next)
})

/*
* ---------------------------------------------------- [ D E L E T E ] --------
* DELETE : /pets/:id
*/
router.delete('/pets/:id', requireToken, (req, res, next) => {
  Pet.findById(req.params.id)
    .then(handle404)
    .then(pet => {
      requireOwnership(req, pet)
      pet.deleteOne()
    })
  // return 204: No Content
    .then(() => res.sendStatus(204))
    .catch(next)
})

/*
 * ---------------------------------------------------- [ U P D A T E ] --------
 * PATCH : /pets/:id
 */
router.patch('/pets/:id', requireToken, removeBlanks, (req, res, next) => {
  const petData = req.body.pet
  // prevents changing the `owner` property
  delete petData.owner

  Pet.findById(req.params.id)
    .then(handle404)
    .then((pet) => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      requireOwnership(req, pet)

      // add random amount to pet happiness
      pet.happiness = pet.happiness + randomNumber(1, 5)
      // save to database
      return pet.save()
    })

    // return 200: OK
    .then((pet) => { res.status(200).json({ pet }) })
    .catch(next)
})

/*
 * ------------------ [ R A N D O M   N U M B E R   G E N E R A T O R ] --------
 */
const randomNumber = function (min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min)
}

module.exports = router
