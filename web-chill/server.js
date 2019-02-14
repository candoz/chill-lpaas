'use strict'
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const fs = require('fs')
const axios = require('axios')
const boom = require('boom')
const bodyParser = require('body-parser')
const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ]
})

const lpaasUrl = 'http://localhost:8080/lpaas'

const theoryPath = lpaasUrl + '/theories/chill'
const goalPath = lpaasUrl + '/goals'
const solutionPath = lpaasUrl + '/solutions'

const chessboardGoalUrl = goalPath + '/chessboard'
const resultGoalUrl = goalPath + '/result'
const turnGoalUrl = goalPath + '/turn'
const lastMoveGoalUrl = goalPath + '/lastmove'

const chessboardSolutionHook = 'chessboard'
const chessboardSolutionUrl = solutionPath + '/' + chessboardSolutionHook
let updatingChessboard = false

const resultSolutionHook = 'result'
const resultSolutionUrl = solutionPath + '/' + resultSolutionHook
let updatingResult = false

const turnSolutionHook = 'turn'
const turnSolutionUrl = solutionPath + '/' + turnSolutionHook
let updatingTurn = false

const lastMoveSolutionHook = 'lastmove'
const lastMoveSolutionUrl = solutionPath + '/' + lastMoveSolutionHook
let updatingLastMove = false

const chillPrologPath = 'src/chess.pl'
const headers = {
  'Content-Type': 'text/plain',
  'Accept': 'application/json'
}
const solutionsHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
const pieces = ['wp', 'wr', 'wn', 'wb', 'wq', 'wk', 'bp', 'br', 'bn', 'bb', 'bq', 'bk', 'e']

let currentResult
let currentChessboard
let currentTurn
let currentLastMove
let drawProposalActive = false

let app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/move', (req, res, next) => {
  logger.log('info', 'Request to move piece %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'move'
  let body = 'do_move(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    queryCurrentGameStateLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/withpromotion', (req, res, next) => {
  logger.log('info', 'Request to move with promotion piece %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'moveAndPromote'
  let body = 'do_move_and_promote(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ',' + req.body.promotion + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    queryCurrentGameStateLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/longcastle', (req, res, next) => {
  logger.log('info', 'Request to do long castle %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'longcastle'
  let body = 'do_long_castle(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    queryCurrentGameStateLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/shortcastle', (req, res, next) => {
  logger.log('info', 'Request to do short castle %s to %s', req.body.startPoint, req.body.endPoint)
  let goalName = 'shortcastle'
  let body = 'do_short_castle(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    logger.log('info', 'Movement completed: %s', lpaasResponse)
    queryCurrentGameStateLPaaS()
    res.send(lpaasResponse)
  })
})

app.get('/lastmoved', (req, res, next) => {
  if (updatingLastMove) {
    res.send(currentLastMove)
  } else {
    axios.get(lastMoveSolutionUrl)
      .then(lpaasResponse => {
        currentLastMove = lpaasResponse.data.solutions.toString().replace('(', '').replace(')', '').replace('last_moved_compact', '')
        res.send(currentLastMove)
      }).catch(err => {
        logger.log('error', 'Error while getting last moves: %s', err)
        next(boom.notFound(err.response))
      })
  }
})

app.get('/move/available', (req, res, next) => {
  logger.log('info', 'Request to get available moves for %s piece', req.body.startPoint)

  let goalName = 'availablemoves'
  let body = 'available_moves_compact(' + wrapCoordinate(req.body.startPoint) + ',R)'

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    logger.log('info', 'Completed available moves for %s piece with result: %s', req.body.startPoint, lpaasResponse)
    res.send(lpaasResponse)
  })
})

app.post('/giveup', (req, res, next) => {
  let goalName = 'giveup'
  let body = 'give_up(' + req.body.playerColor + ')'

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    res.send(lpaasResponse)
  })
})

app.put('/draw/propose', (req, res, next) => {
  drawProposalActive = true // salvare chi propone ???
  res.sendStatus(200)
})

app.put('/draw/accept', (req, res, next) => {
  if (drawProposalActive) {
    let goalName = 'draw'
    let body = 'agree_to_draw(' + req.body.playerColor + ')'

    queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
      drawProposalActive = false
      res.send(lpaasResponse)
    })
  } else {
    next(boom.badRequest('A draw proposal is not active'))
  }
})

app.get('/result', (req, res, next) => {
  if (updatingResult) {
    res.send(currentResult)
  } else {
    axios.get(resultSolutionUrl)
      .then(response => {
        let regex = /\((.*?)\)/
        currentResult = regex.exec(response.data.solutions)[1]
        res.send(currentResult)
      }).catch(err => {
        logger.log('error', 'Request to get result from LPaaS failed: %s', err)
        next(boom.notFound(err.response))
      })
  }
})

app.get('/turn', (req, res, next) => {
  if (updatingTurn) {
    res.send(currentTurn)
  } else {
    axios.get(turnSolutionUrl)
      .then(response => {
        let regex = /\((.*?)\)/
        currentTurn = regex.exec(response.data.solutions)[1]
        res.send(currentTurn)
      }).catch(err => {
        logger.log('error', 'Request to get turn from LPaaS failed: %s', err)
        next(boom.notFound(err.response))
      })
  }
})

app.post('/chessboard', (req, res, next) => {
  logger.log('info', 'Request to reset game state')
  axios.delete(theoryPath)
    .then(response => {
      loadTheoryToLPaaS(result => {
        res.sendStatus(200)
        logger.log('info', 'Reset game done')
      }, error => {
        next(boom.serverUnavailable(error))
        logger.log('error', 'Loading game failed')
      })
    }).catch(error => {
      logger.log('error', 'Reset game failed: %s', error)
      next(boom.serverUnavailable(error))
    })
})

app.get('/chessboard', (req, res, next) => {
  if (updatingChessboard) {
    res.send(currentChessboard)
  } else {
    axios.get(chessboardSolutionUrl)
      .then(response => {
        let parsedChessboard = response.data.solutions[0].toString()
          .replace('(', '').replace(')', '').replace('chessboard_compact', '')
        for (let piece of pieces) {
          parsedChessboard = parsedChessboard.split(piece).join('\"' + piece + '\"')
        }
        let chessboardMatrix = createChessboardMatrix()
        JSON.parse(parsedChessboard).forEach(element => {
          chessboardMatrix[element[0]][element[1]] = element[2]
        })
        currentChessboard = chessboardMatrix
        res.send(currentChessboard)
      }).catch(err => {
        logger.log('error', 'Request to get chessboard from LPaaS failed: %s', err)
        next(boom.notFound(err))
      })
  }
})

loadTheoryToLPaaS(
  response => logger.log('info', 'Chill Theory Loaded to %s', lpaasUrl),
  error => logger.log('error', 'Failed to load theory to LPaaS: %s', error)
)

const port = process.env.PORT || 5000
app.listen(port)

logger.log('info', 'Chill Web Server Started on port: %s', port)

/* ------ UTILITY FUNCTION ------ */

function loadTheoryToLPaaS (callback, errorHandler) {
  let body

  fs.readFile(chillPrologPath, 'utf8', (err, parsed) => {
    if (err) throw logger.log('error', 'Error while reading prolog source file: %s', err)
    logger.log('info', 'Finished up to read chill prolog file')
    body = parsed.replace(/%.*/g, '').replace(/\n/g, ' ').trim()
    axios.post(theoryPath, body, {headers: headers})
      .then(theoryResponse => {
        logger.log('info', 'Initialization: Chill theory loaded to LPaaS')
        callback()
      })
      .catch(theoryError => {
        logger.log('error', 'Initialization: Failed to load chill theory to LPaaS: %s', theoryError)
        errorHandler()
      })
  })

  body = 'chessboard_compact(CC)'
  axios.post(goalPath, body, {params: { name: 'chessboard' }, headers: headers})
    .then(chessboardGoalResponse => logger.log('info', 'Initialization: Chessboard goal loaded to LPaaS'))
    .catch(chessboardGoalError => logger.log('error', 'Initialization: Failed to load Chessboard goal to LPaaS: %s', chessboardGoalError))

  body = 'result(R)'
  axios.post(goalPath, body, {params: { name: 'result' }, headers: headers})
    .then(resultGoalResponse => logger.log('info', 'Initialization: Result goal loaded to LPaaS'))
    .catch(resultGoalError => logger.log('error', 'Initialization: Failed to load Result goal to LPaaS: %s', resultGoalError))

  body = 'turn(T)'
  axios.post(goalPath, body, {params: { name: 'turn' }, headers: headers})
    .then(turnGoalResponse => logger.log('info', 'Initialization: Turn goal loaded to LPaaS'))
    .catch(turnGoalError => logger.log('error', 'Initialization: Failed to load Turn goal to LPaaS: %s', turnGoalError))

  body = 'last_moved_compact(R)'
  axios.post(goalPath, body, {params: { name: 'lastmove' }, headers: headers})
    .then(lastMovedGoalResponse => logger.log('info', 'Initialization: Last move goal loaded to LPaaS'))
    .catch(lastMovedGoalError => logger.log('error', 'Initialization: Failed to load Last move goal to LPaaS: %s', lastMovedGoalError))

  axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: resultSolutionHook }, headers: solutionsHeaders})
    .then(response => logger.log('info', 'Initialization: Loaded Result Solution')).catch(err => logger.log('error', 'Initialization: Result Solution may exist: %s', err))
    .finally(() => queryCurrentResultLPaaS())

  axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: turnSolutionHook }, headers: solutionsHeaders})
    .then(response => logger.log('info', 'Initialization: Loaded Turn Solution')).catch(err => logger.log('error', 'Initialization: Turn Solution may exist: %s', err))
    .finally(() => queryCurrentTurnLPaaS())

  axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: chessboardSolutionHook }, headers: solutionsHeaders})
    .then(response => logger.log('info', 'Initialization: Loaded Chessboard Solution')).catch(err => logger.log('error', 'Initialization: Chessboard Solution may exist: %s', err))
    .finally(() => queryCurrentChessboardLPaaS())

  axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: lastMoveSolutionHook }, headers: solutionsHeaders})
    .then(response => logger.log('info', 'Initialization: Loaded Last Move Solution')).catch(err => logger.log('error', 'Initialization: Last Move Solution may exist: %s', err))
    .finally(() => queryCurrentLastMoveLPaaS())
}

function createChessboardMatrix () {
  let matrix = []
  for (let i = 0; i < 8; i++) {
    matrix[i] = []
    for (let j = 0; j < 8; j++) {
      matrix[i][j] = undefined
    }
  }
  return matrix
}

function deleteLPaaSEntity (url) {
  axios.delete(url)
    .then(response => logger.log('info', 'Deleted %s', url))
    .catch(error => logger.log('error', 'Problem encountered while deleting %s because of: %s', url, error))
}

function wrapCoordinate (coordArray) {
  return 'point(' + coordArray[0] + ',' + coordArray[1] + ')'
}

function queryCurrentGameStateLPaaS () {
  logger.log('info', 'Updating game state...')
  queryCurrentResultLPaaS()
  queryCurrentTurnLPaaS()
  queryCurrentLastMoveLPaaS()
  queryCurrentChessboardLPaaS()
}

function queryCurrentResultLPaaS () {
  updatingResult = true
  axios.delete(resultSolutionUrl).then(response => {
    let body = {
      goals: resultGoalUrl,
      theory: theoryPath
    }
    axios.post(solutionPath, body, {
      headers: solutionsHeaders,
      params: {
        skip: 0,
        limit: 1,
        hook: resultSolutionHook
      }
    }).then(lpaasResponse => {
      updatingResult = false
      logger.log('info', 'Result Solution Updated')
    }).catch(err => {
      logger.log('error', 'Failed to post new result solution: %s', err.response.status)
    })
  }).catch(err => {
    logger.log('error', 'Failed to delete old result solution: %s', err.response.status)
  })
}

function queryCurrentTurnLPaaS () {
  updatingTurn = true
  axios.delete(turnSolutionUrl).then(response => {
    let body = {
      goals: turnGoalUrl,
      theory: theoryPath
    }
    axios.post(solutionPath, body, {
      headers: solutionsHeaders,
      params: {
        skip: 0,
        limit: 1,
        hook: turnSolutionHook
      }
    }).then(lpaasResponse => {
      updatingTurn = false
      logger.log('info', 'Turn Solution Updated')
    }).catch(err => {
      logger.log('error', 'Failed to post new turn solution: %s', err.response.status)
    })
  }).catch(err => {
    logger.log('error', 'Failed to delete old turn solution: %s', err.response.status)
  })
}

function queryCurrentLastMoveLPaaS () {
  updatingLastMove = true
  axios.delete(lastMoveSolutionUrl).then(response => {
    let body = {
      goals: lastMoveGoalUrl,
      theory: theoryPath
    }
    axios.post(solutionPath, body, {
      headers: solutionsHeaders,
      params: {
        skip: 0,
        limit: 1,
        hook: lastMoveSolutionHook
      }
    }).then(response => {
      updatingLastMove = false
      logger.log('info', 'Last Move Solution Updated')
    }).catch(err => {
      logger.log('error', 'Failed to post new last move solution: %s', err.response.status)
    })
  }).catch(err => {
    logger.log('error', 'Failed to delete old last move solution: %s', err.response.status)
  })
}

function queryCurrentChessboardLPaaS () {
  updatingChessboard = true
  axios.delete(chessboardSolutionUrl).then(response => {
    let body = {
      goals: chessboardGoalUrl,
      theory: theoryPath
    }
    axios.post(solutionPath, body, {
      headers: solutionsHeaders,
      params: {
        skip: 0,
        limit: 1,
        hook: chessboardSolutionHook
      }
    }).then(response => {
      updatingChessboard = false
      logger.log('info', 'Chessboard Solution Updated')
    }).catch(err => logger.log('error', 'Failed to post new chessboard solution: ' + err.response.status))
  }).catch(err => logger.log('error', 'Failed to delete old chessboard solution: ' + err.response.status))
}

function queryChillSolutionLPaaS (goalName, prologBody, callback) {
  let body = prologBody
  axios.post(goalPath, body, {params: { name: goalName }, headers: headers})
    .then(goalResponse => {
      body = {
        goals: lpaasUrl + goalResponse.data.link,
        theory: theoryPath
      }
      axios.post(solutionPath, body, {
        headers: solutionsHeaders,
        params: {
          skip: 0,
          limit: 1
        }
      }).then(solutionResponse => {
        deleteLPaaSEntity(goalPath + '/' + goalName)
        deleteLPaaSEntity(lpaasUrl + solutionResponse.data.link)
        callback(solutionResponse.data.solutions)
      }).catch(solutionError => {
        deleteLPaaSEntity(goalPath + '/' + goalName)
        callback(solutionError)
      })
    }).catch(goalError => {
      deleteLPaaSEntity(goalPath + '/' + goalName)
      callback(goalError)
    })
}
