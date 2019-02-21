const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000
const desiredResult = 'draw'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Stalemate Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing shortest stalemate', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [4, 1],
      endPoint: [4, 2]
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
      piece: 'wq',
      startPoint: [3, 0],
      endPoint: [7, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'br',
      startPoint: [0, 7],
      endPoint: [0, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [7, 4],
      endPoint: [0, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bp',
      startPoint: [7, 6],
      endPoint: [7, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [7, 1],
      endPoint: [7, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'br',
      startPoint: [0, 5],
      endPoint: [7, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [0, 4],
      endPoint: [2, 6]
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
      piece: 'wq',
      startPoint: [2, 6],
      endPoint: [3, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bk',
      startPoint: [4, 7],
      endPoint: [5, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [3, 6],
      endPoint: [1, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bq',
      startPoint: [3, 7],
      endPoint: [3, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [1, 6],
      endPoint: [1, 7]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bq',
      startPoint: [3, 2],
      endPoint: [7, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [1, 7],
      endPoint: [2, 7]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bk',
      startPoint: [5, 6],
      endPoint: [6, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'wq',
      startPoint: [2, 7],
      endPoint: [4, 5]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/result')
    assert.equal(JSON.stringify(result.data), JSON.stringify(desiredResult))
  }).timeout(maxTestDuration)
})
