const requestLogger = function (req, res, next) {
  console.log('\n============ BEEP BOOP REQUEST COMING IN ============\n')
  console.log(`${new Date()}`)
  console.log(`${req.method} ${req.url}`)
  console.log(`Request body: ${JSON.stringify(req.body, null, '  ')}`)
  console.log('\n=============== BOOP BOOP REQUEST END ===============\n')
  next()
}

module.exports = requestLogger
