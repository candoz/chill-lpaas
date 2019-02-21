const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000
const desiredResult = 'white_won'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Checkmate Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing fool\'s checkmate', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [4, 1],
      endPoint: [4, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [4, 6],
      endPoint: [4, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wb',
      startPoint: [5, 0],
      endPoint: [2, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bn',
      startPoint: [6, 7],
      endPoint: [5, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [3, 0],
      endPoint: [7, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bn',
      startPoint: [1, 7],
      endPoint: [2, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [7, 4],
      endPoint: [5, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/result')
    assert.equal(JSON.stringify(result.data), JSON.stringify(desiredResult))
  }).timeout(maxTestDuration)
})
