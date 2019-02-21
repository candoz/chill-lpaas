const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Turn Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing first turn as white', async () => {

    await sleep(msToWaitForInit)

    var result = await axios.get(serverUrl + '/turn')
    assert.equal(result.data, 'white')
  }).timeout(maxTestDuration)

  it('Testing second turn as black', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 1],
      endPoint: [2, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/turn')
    assert.equal(result.data, 'black')
  }).timeout(maxTestDuration)

  it('Testing another turn as white after 6 moves', async () => {

    await sleep(msToWaitForInit)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 1],
      endPoint: [2, 2]
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
      startPoint: [3, 1],
      endPoint: [3, 3]
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

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [1, 1],
      endPoint: [1, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    await axios.post(serverUrl + '/move', {
      piece: 'bq',
      startPoint: [0, 4],
      endPoint: [2, 6]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/turn')
    assert.equal(result.data, 'white')
  }).timeout(maxTestDuration)

  it('Testing another turn as black after 3 moves', async () => {

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
      piece: 'wp',
      startPoint: [3, 1],
      endPoint: [3, 3]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    var result = await axios.get(serverUrl + '/turn')
    assert.equal(result.data, 'black')
  }).timeout(maxTestDuration)
})
