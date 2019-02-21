const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Check Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing shortest black check', async () => {

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
      startPoint: [5, 6],
      endPoint: [5, 4]
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

    var result = await axios.get(serverUrl + '/result')
    assert.equal(JSON.stringify(result.data), JSON.stringify('black_in_check'))
  }).timeout(maxTestDuration)

  it('Testing shortest white check', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [3, 1],
      endPoint: [3, 2]
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
      piece: 'wn',
      startPoint: [6, 0],
      endPoint: [5, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bq',
      startPoint: [3, 7],
      endPoint: [0, 4]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/result')
    assert.equal(JSON.stringify(result.data), JSON.stringify('white_in_check'))
  }).timeout(maxTestDuration)
})
