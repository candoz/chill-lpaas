'use strict'
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const fs = require('fs')
const axios = require('axios')
const boom = require('boom')
const bodyParser = require('body-parser')

const lpaasUrl = 'http://localhost:8080/lpaas'
const theoryPath = lpaasUrl + '/theories/chill'
const goalPath = lpaasUrl + '/goals'
const solutionPath = lpaasUrl + '/solutions'
const chessboardGoalUrl = goalPath + '/chessboard'
const resultGoalUrl = goalPath + '/result'
const turnGoalUrl = goalPath + '/turn'
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
let drawProposalActive = false

let app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/move', (req, res, next) => {
  console.log('Requested to move a piece')
  let goalName = 'move'
  let body = 'do_move(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    queryCurrentResultLPaaS()
    queryCurrentTurnLPaaS()
    queryCurrentChessboardLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/withpromotion', (req, res, next) => {
  let goalName = 'moveAndPromote'
  let body = 'do_move_and_promote(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ',' + req.body.promotion + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    queryCurrentResultLPaaS()
    queryCurrentTurnLPaaS()
    queryCurrentChessboardLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/longcastle', (req, res, next) => {
  let goalName = 'longcastle'
  let body = 'do_long_castle(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    queryCurrentResultLPaaS()
    queryCurrentTurnLPaaS()
    queryCurrentChessboardLPaaS()
    res.send(lpaasResponse)
  })
})

app.post('/move/shortcastle', (req, res, next) => {
  let goalName = 'shortcastle'
  let body = 'do_short_castle(' + req.body.piece + ',' + wrapCoordinate(req.body.startPoint) + ',' + wrapCoordinate(req.body.endPoint) + ')'
  drawProposalActive = false

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    queryCurrentResultLPaaS()
    queryCurrentTurnLPaaS()
    queryCurrentChessboardLPaaS()
    res.send(lpaasResponse)
  })
})

app.get('/move/available', (req, res, next) => {
  let goalName = 'availablemoves'
  let body = 'available_moves_compact(' + wrapCoordinate(req.body.startPoint) + ',R)'

  queryChillSolutionLPaaS(goalName, body, lpaasResponse => {
    console.log(lpaasResponse)
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
  res.send(currentResult)
})

app.get('/turn', (req, res, next) => {
  res.send(currentTurn)
})

app.post('/chessboard', (req, res, next) => {
  axios.delete(theoryPath)
    .then(response => {
      console.log('Deleted Chill Theory')
      axios.delete(chessboardGoalUrl)
        .then(goalResponse => {
          console.log('Deleted Chessboard Goal')
          loadTheoryToLPaaS(result => res.sendStatus(200), error => next(boom.serverUnavailable(error)))
        })
        .catch(goalError => {
          next(boom.serverUnavailable(goalError))
        })
    }).catch(error => {
      next(boom.serverUnavailable(error))
    })
})

app.get('/chessboard', (req, res, next) => {
  res.send(currentChessboard)
})

loadTheoryToLPaaS(response => console.log('Chill Theory Loaded to ' + lpaasUrl), error => console.log('Failed to load theory to LPaaS: ' + error))

const port = process.env.PORT || 5000
app.listen(port)

console.log('Chill Web Server Started on port: ' + port)

/* ------ UTILITY FUNCTION ------ */

function loadTheoryToLPaaS (callback, errorHandler) {
  let body

  fs.readFile(chillPrologPath, 'utf8', (err, parsed) => {
    if (err) throw err
    body = parsed.replace(/%.*/g, '').replace(/\n/g, ' ').trim()
    axios.post(theoryPath, body, {headers: headers})
      .then(theoryResponse => console.log('Chill theory loaded to LPaaS: ' + theoryResponse))
      .catch(theoryError => console.log('Failed to load chill theory to LPaaS: ' + theoryError))
  })

  body = 'chessboard_compact(CC)'
  axios.post(goalPath, body, {params: { name: 'chessboard' }, headers: headers})
    .then(chessboardGoalResponse => console.log('Chessboard goal loaded to LPaaS: ' + chessboardGoalResponse))
    .catch(chessboardGoalError => console.log('Failed to load Chessboard goal to LPaaS: ' + chessboardGoalError))
    .finally(() => queryCurrentChessboardLPaaS())

  body = 'result(R)'
  axios.post(goalPath, body, {params: { name: 'result' }, headers: headers})
    .then(resultGoalResponse => console.log('Result goal loaded to LPaaS: ' + resultGoalResponse))
    .catch(resultGoalError => console.log('Failed to load Result goal to LPaaS: ' + resultGoalError))
    .finally(() => queryCurrentResultLPaaS())

  body = 'turn(T)'
  axios.post(goalPath, body, {params: { name: 'turn' }, headers: headers})
    .then(turnGoalResponse => console.log('Turn goal loaded to LPaaS: ' + turnGoalResponse))
    .catch(turnGoalError => console.log('Failed to load Turn goal to LPaaS: ' + turnGoalError))
    .finally(() => queryCurrentTurnLPaaS())
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
    .then(response => console.log('Deleted ' + url))
    .catch(error => console.log('Problem encountered while deleting ' + url + ' because of: ' + error))
}

function wrapCoordinate (coordArray) {
  return 'point(' + coordArray[0] + ',' + coordArray[1] + ')'
}

function queryCurrentResultLPaaS () {
  queryChillWithCustomGoal(resultGoalUrl)
}

function queryCurrentTurnLPaaS () {
  queryChillWithCustomGoal(turnGoalUrl)
}

function queryChillWithCustomGoal (goalPath) {
  let body = {
    goals: goalPath,
    theory: theoryPath
  }
  axios.post(solutionPath, body, {
    headers: solutionsHeaders,
    params: {
      skip: 0,
      limit: 1
    }
  }).then(lpaasResponse => {
    let regex = /\(([^()]+)\)/g
    currentTurn = regex.exec(lpaasResponse.data.solutions)[1]
  })
}

function queryCurrentChessboardLPaaS () {
  let body = {
    goals: lpaasUrl + chessboardGoalUrl,
    theory: theoryPath
  }
  axios.post(solutionPath, body, {
    headers: solutionsHeaders,
    params: {
      skip: 0,
      limit: 1
    }
  }).then(response => {
    let parsedChessboard = response.data.solutions.toString()
      .replace('(', '').replace(')', '').replace('chessboard_compact', '')
    for (let piece of pieces) {
      parsedChessboard = parsedChessboard.split(piece).join('\"' + piece + '\"')
    }
    let chessboardMatrix = createChessboardMatrix()
    JSON.parse(parsedChessboard).forEach(element => {
      chessboardMatrix[element[0]][element[1]] = element[2]
    })
    currentChessboard = chessboardMatrix
  })
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
      })
        .then(solutionResponse => {
          deleteLPaaSEntity(goalPath + '/' + goalName)
          deleteLPaaSEntity(lpaasUrl + solutionResponse.data.link)
          callback(solutionResponse.data.solutions)
        })
        .catch(solutionError => {
          deleteLPaaSEntity(goalPath + '/' + goalName)
          // TODO leggere l'errore di lpaas e mapparlo con un errore per il client
          callback(solutionError)
        })
    })
    .catch(goalError => {
      deleteLPaaSEntity(goalPath + '/' + goalName)
      // TODO leggere l'errore di lpaas e mapparlo con un errore per il client
      callback(goalError)
    })
}
