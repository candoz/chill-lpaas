"use strict"
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
const chessboardGoalUrl = goalPath + '/chessboard/'
const chillPrologPath = 'src/chess.pl'
const headers = {
  'Content-Type':'text/plain',
  'Accept': 'application/json'
}
const solutionsHeaders = {
  'Content-Type':'application/json',
  'Accept': 'application/json'
}
const pieces = ["wp","wr","wn","wb","wq","wk","bp","br","bn","bb","bq","bk","e"]

let app = express()
app.use(serveStatic(__dirname + "/dist"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* INIT CHESSBOARD / NEW MATCH */
app.post('/chessboard', function(req, res, next) {
  loadTheoryToLPaaS(result => res.sendStatus(200), error => next(boom.serverUnavailable(error)))
})

/* MOVE */
app.post('/move', function(req, res, next) {

  let goalName = 'move'

  let body = 'do_move(' + req.body.piece + ',' + req.body.startPoint + ',' + req.body.endPoint + ')'
  console.log(body)

  axios.post(goalPath, body, {params: { name: goalName }, headers: headers})
  .then(goalResponse => {
    body = {
      goals: lpaasUrl+goalResponse.data.link,
      theory: theoryPath,
    }
    axios.post(solutionPath, body, {
      headers: solutionsHeaders, 
      params: {
        skip: 0,
        limit: 1
      }
    })
    .then(solutionResponse => {
      deleteLPaaSEntity(goalPath+'/'+goalName)
      deleteLPaaSEntity(lpaasUrl+solutionResponse.data.link)
      res.send(solutionResponse.data.solutions)
    })
    .catch(solutionError => {
      deleteLPaaSEntity(goalPath+'/'+goalName)
      res.send(solutionError)
    })
  })
  .catch(goalError => {
    deleteLPaaSEntity(goalPath+'/'+goalName)
    res.send(goalError)
  })

})

/* MOVE AND PROMOTE */

/* CASTLE */

/* GET CHESSBOARD */
app.get('/chessboard', function(req, res, next) {
  let body = {
    goals: lpaasUrl+chessboardGoalUrl,
    theory: theoryPath,
  }
  axios.post(solutionPath, body, {
    headers: solutionsHeaders, 
    params: {
      skip: 0,
      limit: 1
    }
  })
  .then(response => {
    let parsedChessboard = response.data.solutions.toString()
      .replace('(','').replace(')','').replace('chessboard','')
      
      console.log(parsedChessboard)
    for (let piece of pieces) {
      parsedChessboard = parsedChessboard.split(piece).join("\""+piece+"\"")
    }

    let chessboardMatrix = createChessboardMatrix()
    JSON.parse(parsedChessboard).forEach(element => {
      chessboardMatrix[element[0]][element[1]] = element[2]
    });
  
    res.send(chessboardMatrix)
  })
  .catch(error => next(boom.badRequest(error)))
})

/* CHECK RESULT */

loadTheoryToLPaaS(response => console.log("Chill Theory Loaded to "+lpaasUrl), error => console.log(error))

const port = process.env.PORT || 5000;
app.listen(port);

console.log('Chill Web Server Started on port: ' + port);

function loadTheoryToLPaaS (callback, errorHandler) {
  fs.readFile(chillPrologPath, 'utf8', function(err, parsed) {
    if (err) throw err

    let body = parsed.replace(/%.*/g, '').replace(/\n/g, ' ').trim()
    
    axios.post(theoryPath, body, {headers: headers})
    .then(theoryResponse => {
      body = 'chessboard(R)'
      axios.post(goalPath, body, {params: { name: 'chessboard' }, headers: headers})
      .then(goalResponse => {
        callback(goalResponse)
      })
      .catch(goalError => errorHandler(goalError))
    })
    .catch(theoryError => errorHandler(theoryError))
  })
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

function deleteLPaaSEntity(url) {
  axios.delete(url)
  .then(response => console.log('Deleted ' + url))
  .catch(error => console.log('Problem encountered while deleting ' + url))
}