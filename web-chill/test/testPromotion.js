const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Promotion Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing promotion to white queen', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [0, 1],
      endPoint: [0, 3]
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
      piece: 'wp',
      startPoint: [0, 3],
      endPoint: [0, 4]
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
      piece: 'wp',
      startPoint: [0, 4],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bb',
      startPoint: [5, 7],
      endPoint: [1, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [0, 5],
      endPoint: [1, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bq',
      startPoint: [3, 7],
      endPoint: [4, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/withpromotion', {
      piece: 'wp',
      startPoint: [1, 6],
      endPoint: [0, 7],
      promotion: 'wq'
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/chessboard')
    assert.equal(JSON.stringify(result.data[0][7]), JSON.stringify('wq'))
  }).timeout(maxTestDuration)

  it('Testing promotion to white rook', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 1],
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
      piece: 'wp',
      startPoint: [2, 3],
      endPoint: [2, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [0, 6],
      endPoint: [0, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 4],
      endPoint: [2, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [0, 4],
      endPoint: [0, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 5],
      endPoint: [1, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'br',
      startPoint: [0, 7],
      endPoint: [0, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move/withpromotion', {
      piece: 'wp',
      startPoint: [1, 6],
      endPoint: [2, 7],
      promotion: 'wr'
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/chessboard')
    assert.equal(JSON.stringify(result.data[2][7]), JSON.stringify('wr'))
  }).timeout(maxTestDuration)
})
