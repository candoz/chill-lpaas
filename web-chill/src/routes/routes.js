// initialize theory in LPaaS


module.exports = (function () {

  let dbRoutes = require("express").Router()

  dbRoutes.get("/gamestate", function(req, res, next) {
    dbPoolConnection.collection("Users").findOne(new ObjectId(req.session.userId), function (err, dbResLoggedUser) {
      if (err) return next(boom.badImplementation(err))
      res.send(chessboard)
    })
  })

  return dbRoutes
}) ()
