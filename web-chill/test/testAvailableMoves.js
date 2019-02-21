const assert = require('assert')
const axios = require('axios')
const serverUrl = 'http://localhost:5000'
const msToWaitForInit = 2000
const maxTestDuration = 25000

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test Long Availabel Moves Cases', function () {

  beforeEach( async () => {
    await axios.post(serverUrl + '/chessboard')
  })

  it('Testing availables moves for pawn', async () => {
    await sleep(msToWaitForInit)

    let params = { startPoint: '[0, 1]' }
    let result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 2)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [0, 1],
      endPoint: [0, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    params = { startPoint: '[0, 2]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 1)
  }).timeout(maxTestDuration)

  it('Testing availables moves for knight', async () => {
    await sleep(msToWaitForInit)

    let params = { startPoint: '[1, 0]' }
    let result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 2)

    await axios.post(serverUrl + '/move', {
      piece: 'wn',
      startPoint: [1, 0],
      endPoint: [0, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    params = { startPoint: '[0, 2]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 3)
  }).timeout(maxTestDuration)

  it('Testing availables moves for bishop', async () => {
    await sleep(msToWaitForInit)

    let params = { startPoint: '[2, 0]' }
    let result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 0)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [3, 1],
      endPoint: [3, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    params = { startPoint: '[2, 0]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 5)
  }).timeout(maxTestDuration)

  it('Testing availables moves for queen', async () => {
    await sleep(msToWaitForInit)

    let params = { startPoint: '[3, 0]' }
    let result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 0)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [2, 1],
      endPoint: [2, 2]
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    params = { startPoint: '[3, 0]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 3)
  }).timeout(maxTestDuration)

  it('Testing availables moves for rook', async () => {
    await sleep(msToWaitForInit)

    let params = { startPoint: '[0, 0]' }
    let result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 0)

    await axios.post(serverUrl + '/move', {
      piece: 'wp',
      startPoint: [0, 1],
      endPoint: [0, 3]
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

    params = { startPoint: '[0, 0]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 2)

    await axios.post(serverUrl + '/move', {
      piece: 'wr',
      startPoint: [0, 0],
      endPoint: [0, 2]
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

    params = { startPoint: '[0, 2]' }
    result = await axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} })
    assert.equal(result.data.length, 9)
  }).timeout(maxTestDuration)
})
