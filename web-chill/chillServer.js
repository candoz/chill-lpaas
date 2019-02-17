'use strict'
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const boom = require('boom')

const loggerUtility = require('./serverSrc/loggerUtility')
const logger = loggerUtility.winstonLogger

const lpaas = require('./serverSrc/lpaasRequest')

const utility = require('./serverSrc/utilityFunction')

const pieces = ['wp', 'wr', 'wn', 'wb', 'wq', 'wk', 'bp', 'br', 'bn', 'bb', 'bq', 'bk', 'e']

let resultCache = 'nothing'
let chessboardCache = []
let turnCache = 'white'
let lastMoveCache = []
let updatingChessboard = false
let updatingTurn = false
let updatingLastMove = false

let app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/move', (req, res, next) => {
  logger.log('info', 'Request to move piece %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'move'
  let body = 'do_move(' + req.body.piece + ',' + utility.wrapCoordinate(req.body.startPoint) + ',' + utility.wrapCoordinate(req.body.endPoint) + ')'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    updateGameState()
    res.send(lpaasResponse)
  })
})

app.post('/move/withpromotion', (req, res, next) => {
  logger.log('info', 'Request to move with promotion piece %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'moveAndPromote'
  let body = 'do_move_and_promote(' + req.body.piece + ',' + utility.wrapCoordinate(req.body.startPoint) + ',' + utility.wrapCoordinate(req.body.endPoint) + ',' + req.body.promotion + ')'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    updateGameState()
    res.send(lpaasResponse)
  })
})

app.post('/move/longcastle', (req, res, next) => {
  logger.log('info', 'Request to do long castle %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'longcastle'
  let body = 'do_long_castle(' + req.body.piece + ',' + utility.wrapCoordinate(req.body.startPoint) + ',' + utility.wrapCoordinate(req.body.endPoint) + ')'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    updateGameState()
    res.send(lpaasResponse)
  })
})

app.post('/move/shortcastle', (req, res, next) => {
  logger.log('info', 'Request to do short castle %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'shortcastle'
  let body = 'do_short_castle(' + req.body.piece + ',' + utility.wrapCoordinate(req.body.startPoint) + ',' + utility.wrapCoordinate(req.body.endPoint) + ')'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    updateGameState()
    res.send(lpaasResponse)
  })
})

app.get('/lastmoved', (req, res, next) => {
  if (updatingLastMove) {
    res.send(lastMoveCache)
  } else {
    lpaas.getSolutionResult(
      lpaas.lastMoveSolutionUrl,
      response => {
        lastMoveCache = response.data.solutions.toString().replace('(', '').replace(')', '').replace('last_moved_compact', '')
        res.send(lastMoveCache)
      },
      error => {
        logger.log('error', 'Error while getting last moves: %s', error)
        next(boom.notFound(error.response))
      })
  }
})

app.put('/move/available', (req, res, next) => { // cambiare in get, parametri invece che body
  logger.log('info', 'Request to get available moves for %s piece', req.body.startPoint)
  let goalName = 'availablemoves'
  let body = 'available_moves_compact(' + req.body.startPoint + ',R)'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Completed available moves for %s piece with result: %s', req.body.startPoint, lpaasResponse)
    let parsedAvailableMoves = lpaasResponse.toString()
      .replace('(', '').replace(')', '').replace('available_moves_compact', '')
    let regex = /\[\[(.*?)\]\]/g
    let result = regex.exec(parsedAvailableMoves)
    if (result) res.send(result[0])
    else res.send([])
  })
})

app.post('/giveup', (req, res, next) => {
  let goalName = 'giveup'
  let body = 'give_up(' + req.body.playerColor + ')'

  lpaas.genericUpdateBySolution(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    updateGameState()
    res.send(lpaasResponse)
  })
})

app.post('/chessboard', (req, res, next) => {
  logger.log('info', 'Request to reset game state')
  lpaas.deleteLPaaSEntity(
    lpaas.theoryPath,
    response => {
      lpaas.loadChillTheory(
        response => {
          logger.log('info', 'Reset game state completed')
          updateGameState()
        },
        error => logger.log('info', 'Reset game state failed: %s', error)
      )
    },
    error => logger.log('info', 'Reset game state failed: %s', error))
  res.send(200)
})

app.get('/result', (req, res, next) => {
  res.send(resultCache)
})

app.get('/turn', (req, res, next) => {
  if (updatingTurn) {
    res.send(turnCache)
  } else {
    lpaas.getSolutionResult(
      lpaas.turnSolutionUrl,
      response => {
        let regex = /\((.*?)\)/
        turnCache = regex.exec(response.data.solutions)[1]
        res.send(turnCache)
      },
      err => {
        logger.log('error', 'Request to get turn from LPaaS failed: %s', err)
        next(boom.notFound(err.response))
      }
    )
  }
})

app.get('/chessboard', (req, res, next) => {
  if (updatingChessboard) {
    res.send(chessboardCache)
  } else {
    lpaas.getSolutionResult(
      lpaas.chessboardSolutionUrl,
      response => {
        let parsedChessboard = response.data.solutions[0].toString()
          .replace('(', '').replace(')', '').replace('chessboard_compact', '')
        for (let piece of pieces) {
          parsedChessboard = parsedChessboard.split(piece).join('\"' + piece + '\"')
        }
        let chessboardMatrix = utility.chessboardMatrixCreator(8)
        JSON.parse(parsedChessboard).forEach(element => {
          chessboardMatrix[element[0]][element[1]] = element[2]
        })
        chessboardCache = chessboardMatrix
        res.send(chessboardCache)
      },
      err => {
        logger.log('error', 'Request to get chessboard from LPaaS failed: %s', err)
        next(boom.notFound(err))
      }
    )
  }
})

lpaas.loadChillTheory(
  response => {
    logger.log('info', 'Chill Loaded')
    updateGameState()
  },
  error => logger.log('error', 'Failed to load theory to LPaaS: %s', error)
)
lpaas.loadDefaultGoalAndSolution()

const port = process.env.PORT || 5000
app.listen(port)

logger.log('info', 'Chill Web Server Started on port: %s', port)

function updateGameState () {
  lpaas.updateGameResultSolution(solution => {
    let regex = /\((.*?)\)/
    resultCache = regex.exec(solution)[1]
  })
  updatingTurn = true
  lpaas.updateGameTurnSolution(response => {
    updatingTurn = false
  })
  updatingLastMove = true
  lpaas.updateGameLastMoveSolution(response => {
    updatingLastMove = false
  })
  updatingChessboard = true
  lpaas.updateGameChessboardSolution(response => {
    updatingChessboard = false
  })
}
