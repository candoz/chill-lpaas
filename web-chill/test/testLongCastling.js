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

describe('Test Long Castling Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing a working long castling', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wn',
      startPoint: [1, 0],
      endPoint: [2, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [0, 6],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [1, 1],
      endPoint: [1, 2]
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
      startPoint: [2, 0],
      endPoint: [0, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [2, 6],
      endPoint: [2, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [4, 1],
      endPoint: [4, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [3, 6],
      endPoint: [3, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [3, 0],
      endPoint: [4, 1]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [4, 6],
      endPoint: [4, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/longcastle', {
      piece: 'wk',
      startPoint: [4, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var chessboard = await axios.get(serverUrl + '/chessboard')
    assert.equal(chessboard.data[2][0], kingRep)
    assert.equal(chessboard.data[3][0], rookRep)
  }).timeout(maxTestDuration)

  it('Testing a not working long castling because of rook has moved before', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wn',
      startPoint: [1, 0],
      endPoint: [2, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [0, 6],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [1, 1],
      endPoint: [1, 2]
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
      startPoint: [2, 0],
      endPoint: [0, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [2, 6],
      endPoint: [2, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [4, 1],
      endPoint: [4, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [3, 6],
      endPoint: [3, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [3, 0],
      endPoint: [4, 1]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [4, 6],
      endPoint: [4, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wr',
      startPoint: [0, 0],
      endPoint: [1, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [5, 6],
      endPoint: [5, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wr',
      startPoint: [1, 0],
      endPoint: [0, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/longcastle', {
      piece: 'wk',
      startPoint: [4, 0]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var chessboard = await axios.get(serverUrl + '/chessboard')
    assert.equal(chessboard.data[4][0], kingRep)
    assert.equal(chessboard.data[0][0], rookRep)
  }).timeout(maxTestDuration)
})
