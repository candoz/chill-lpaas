const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000
const kingRep = 'wk'
const rookRep = 'wr'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Short Castling Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing a working short castling', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wn',
      startPoint: [6, 0],
      endPoint: [5, 2]
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
      piece: 'wp',
      startPoint: [6, 1],
      endPoint: [6, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [1, 6],
      endPoint: [1, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wb',
      startPoint: [5, 0],
      endPoint: [7, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bb',
      startPoint: [2, 7],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/shortcastle', {
      piece: 'wk',
      startPoint: [4, 0],
      endPoint: [6, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var chessboard = await axios.get(serverUrl + '/chessboard')
    assert.equal(chessboard.data[6][0], kingRep)
    assert.equal(chessboard.data[5][0], rookRep)
  }).timeout(maxTestDuration)

  it('Testing to move rook before castling then castling should be fail', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wn',
      startPoint: [6, 0],
      endPoint: [5, 2]
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
      piece: 'wp',
      startPoint: [6, 1],
      endPoint: [6, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [1, 6],
      endPoint: [1, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wb',
      startPoint: [5, 0],
      endPoint: [7, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bb',
      startPoint: [2, 7],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wr',
      startPoint: [7, 0],
      endPoint: [6, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [1, 5],
      endPoint: [1, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wr',
      startPoint: [6, 0],
      endPoint: [7, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/shortcastle', {
      piece: 'wk',
      startPoint: [4, 0],
      endPoint: [6, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var chessboard = await axios.get(serverUrl + '/chessboard')
    assert.equal(chessboard.data[4][0], kingRep)
    assert.equal(chessboard.data[7][0], rookRep)
  }).timeout(maxTestDuration)
})
