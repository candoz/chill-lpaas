const fs = require('fs')
const axios = require('axios')
const retryInterceptor = require('axios-retry-interceptor')
retryInterceptor(axios, {
  maxAttempts: 3,
  waitTime: 1000
})

const loggerUtility = require('./loggerUtility')
const logger = loggerUtility.winstonLogger

const lpaasUrl = 'http://lpaas-ws:8080/lpaas'

const theoryPath = lpaasUrl + '/theories/chill'
const goalPath = lpaasUrl + '/goals'
const solutionPath = lpaasUrl + '/solutions'

const chessboardGoalUrl = goalPath + '/chessboard'
const resultGoalUrl = goalPath + '/result'
const turnGoalUrl = goalPath + '/turn'
const lastMoveGoalUrl = goalPath + '/lastmove'

const chessboardSolutionHook = 'chessboard'
const chessboardSolutionUrl = solutionPath + '/' + chessboardSolutionHook

const resultSolutionHook = 'result'
const resultSolutionUrl = solutionPath + '/' + resultSolutionHook

const turnSolutionHook = 'turn'
const turnSolutionUrl = solutionPath + '/' + turnSolutionHook

const lastMoveSolutionHook = 'lastmove'
const lastMoveSolutionUrl = solutionPath + '/' + lastMoveSolutionHook

const chillPrologPath = 'src/chess.pl'
const headers = {
  'Content-Type': 'text/plain',
  'Accept': 'application/json'
}
const solutionsHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

function loadChillTheory (callback, errorHandler) {
  fs.readFile(chillPrologPath, 'utf8', (err, parsed) => {
    if (err) throw logger.log('error', 'Error while reading prolog source file: %s', err)
    logger.log('info', 'Finished up to read chill prolog file')
    let body = parsed.replace(/%.*/g, '').replace(/\n/g, ' ').trim()
    axios.post(lpaasUrl + '/theories', body, {headers: headers, params: { name: 'chill' }})
      .then(theoryResponse => {
        logger.log('info', 'Initialization: Chill theory loaded to LPaaS')
        callback(theoryResponse)
      })
      .catch(theoryError => {
        logger.log('error', 'Initialization: Failed to load chill theory to LPaaS: %s', theoryError)
        errorHandler(theoryError)
      })
  })
}

function loadDefaultGoalAndSolution (callback) {
  let body = 'chessboard_compact(CC)'
  axios.post(goalPath, body, {params: { name: 'chessboard' }, headers: headers})
    .then(chessboardGoalResponse => logger.log('info', 'Initialization: Chessboard goal loaded to LPaaS'))
    .catch(chessboardGoalError => logger.log('error', 'Initialization: Failed to load Chessboard goal to LPaaS: %s', chessboardGoalError))
    .finally(() => {
      body = 'result(R)'
      axios.post(goalPath, body, {params: { name: 'result' }, headers: headers})
        .then(resultGoalResponse => logger.log('info', 'Initialization: Result goal loaded to LPaaS'))
        .catch(resultGoalError => logger.log('error', 'Initialization: Failed to load Result goal to LPaaS: %s', resultGoalError))
        .finally(() => {
          body = 'turn(T)'
          axios.post(goalPath, body, {params: { name: 'turn' }, headers: headers})
            .then(turnGoalResponse => logger.log('info', 'Initialization: Turn goal loaded to LPaaS'))
            .catch(turnGoalError => logger.log('error', 'Initialization: Failed to load Turn goal to LPaaS: %s', turnGoalError))
            .finally(() => {
              body = 'last_moved_compact(R)'
              axios.post(goalPath, body, {params: { name: 'lastmove' }, headers: headers})
                .then(lastMovedGoalResponse => logger.log('info', 'Initialization: Last move goal loaded to LPaaS'))
                .catch(lastMovedGoalError => logger.log('error', 'Initialization: Failed to load Last move goal to LPaaS: %s', lastMovedGoalError))
                .finally(() => {
                  axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: resultSolutionHook }, headers: solutionsHeaders})
                    .then(response => logger.log('info', 'Initialization: Loaded Result Solution'))
                    .catch(err => logger.log('error', 'Initialization: Result Solution may exist: %s', err))
                    .finally(() => {
                      axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: turnSolutionHook }, headers: solutionsHeaders})
                        .then(response => logger.log('info', 'Initialization: Loaded Turn Solution'))
                        .catch(err => logger.log('error', 'Initialization: Turn Solution may exist: %s', err))
                        .finally(() => {
                          axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: chessboardSolutionHook }, headers: solutionsHeaders})
                            .then(response => logger.log('info', 'Initialization: Loaded Chessboard Solution'))
                            .catch(err => logger.log('error', 'Initialization: Chessboard Solution may exist: %s', err))
                            .finally(() => {
                              axios.post(solutionPath, null, {params: { skip: 0, limit: 1, hook: lastMoveSolutionHook }, headers: solutionsHeaders})
                                .then(response => logger.log('info', 'Initialization: Loaded Last Move Solution'))
                                .catch(err => logger.log('error', 'Initialization: Last Move Solution may exist: %s', err))
                                .finally(() => {
                                  if (callback) callback()
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

function updateGameResultSolution (callback) {
  let time
  axios.delete(resultSolutionUrl)
    .then(response => logger.log('info', 'Deleted old result solution'))
    .catch(err => logger.log('error', 'Failed to delete old result solution: %s', err.response.status))
    .finally(() => {
      let body = {
        goals: resultGoalUrl,
        theory: theoryPath
      }
      time = Date.now()
      axios.post(solutionPath, body, {
        headers: solutionsHeaders,
        params: {
          skip: 0,
          limit: 1,
          hook: resultSolutionHook
        }
      }).then(lpaasResponse => {
        callback(lpaasResponse.data.solutions)
        logger.log('info', 'Result Calculation Timer: %s', (Date.now() - time))
      }).catch(err => {
        logger.log('error', 'Failed to post new result solution: %s', err.response.status)
      })
    })
}

function updateGameTurnSolution (callback) {
  axios.delete(turnSolutionUrl)
    .then(response => logger.log('info', 'Deleted old turn solution'))
    .catch(err => logger.log('error', 'Failed to delete old turn solution: %s', err.response.status))
    .finally(() => {
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
        callback(lpaasResponse)
        logger.log('info', 'Turn Solution Updated')
      }).catch(err => {
        logger.log('error', 'Failed to post new turn solution: %s', err.response.status)
      })
    })
}

function updateGameLastMoveSolution (callback) {
  axios.delete(lastMoveSolutionUrl)
    .then(response => logger.log('info', 'Deleted old last move solution'))
    .catch(err => logger.log('error', 'Failed to delete old last move solution: %s', err.response.status))
    .finally(() => {
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
      }).then(lpaasResponse => {
        callback(lpaasResponse)
        logger.log('info', 'Last Move Solution Updated')
      }).catch(err => {
        logger.log('error', 'Failed to post new last move solution: %s', err.response.status)
      })
    })
}

function updateGameChessboardSolution (callback) {
  axios.delete(chessboardSolutionUrl)
    .then(response => logger.log('info', 'Deleted old chessboard solution'))
    .catch(err => logger.log('error', 'Failed to delete old chessboard solution: ' + err.response.status))
    .finally(() => {
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
      }).then(lpaasResponse => {
        callback(lpaasResponse)
        logger.log('info', 'Chessboard Solution Updated')
      }).catch(err => logger.log('error', 'Failed to post new chessboard solution: ' + err.response.status))
    })
}

function genericUpdateBySolution (goalName, prologBody, callback) {
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

function deleteLPaaSEntity (url, callback, error) {
  axios.delete(url)
    .then(response => {
      if (callback) callback(response)
      logger.log('info', 'Deleted %s', url)
    })
    .catch(err => {
      if (error) error(err)
      logger.log('error', 'Problem encountered while deleting %s because of: %s', url, error)
    })
}

function getSolutionResult (url, callback, error) {
  axios.get(url)
    .then(response => callback(response))
    .catch(err => error(err))
}

module.exports = {

  theoryPath: theoryPath,
  lpaasUrl: lpaasUrl,
  chessboardSolutionUrl: chessboardSolutionUrl,
  resultSolutionUrl: resultSolutionUrl,
  turnSolutionUrl: turnSolutionUrl,
  lastMoveSolutionUrl: lastMoveSolutionUrl,
  loadChillTheory: loadChillTheory,
  loadDefaultGoalAndSolution: loadDefaultGoalAndSolution,
  updateGameResultSolution: updateGameResultSolution,
  updateGameTurnSolution: updateGameTurnSolution,
  updateGameLastMoveSolution: updateGameLastMoveSolution,
  updateGameChessboardSolution: updateGameChessboardSolution,
  genericUpdateBySolution: genericUpdateBySolution,
  deleteLPaaSEntity: deleteLPaaSEntity,
  getSolutionResult: getSolutionResult
}
