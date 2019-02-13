import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const PlayerColor = {
  BLACK: 'black',
  WHITE: 'white'
}

const ResultStatus = {
  STILL_GAMING: 'still gaming',
  BLACK_WON: 'black',
  WHITE_WON: 'white',
  DRAW: 'draw',
  UNDER_CHECK: 'under check'
}

const ChessPiece = Object.freeze({
  WP: {rep: 'wp', color: PlayerColor.WHITE},
  WB: {rep: 'wb', color: PlayerColor.WHITE},
  WN: {rep: 'wn', color: PlayerColor.WHITE},
  WR: {rep: 'wr', color: PlayerColor.WHITE},
  WK: {rep: 'wk', color: PlayerColor.WHITE},
  WQ: {rep: 'wq', color: PlayerColor.WHITE},
  BP: {rep: 'bp', color: PlayerColor.BLACK},
  BB: {rep: 'bb', color: PlayerColor.BLACK},
  BN: {rep: 'bn', color: PlayerColor.BLACK},
  BR: {rep: 'br', color: PlayerColor.BLACK},
  BK: {rep: 'bk', color: PlayerColor.BLACK},
  BQ: {rep: 'bq', color: PlayerColor.BLACK}
})

const testChessBoard = createTestChessBoard()
function createTestChessBoard () {
  let matrix = []
  for (let i = 0; i < 8; i++) {
    matrix[i] = []
    for (let j = 0; j < 8; j++) {
      matrix[i][j] = 'e'
    }
  }
  return matrix
}

export const store = new Vuex.Store({
  strict: true,
  state: {
    currentTurn: PlayerColor.WHITE,
    playerColor: PlayerColor.WHITE,
    chessboard: testChessBoard,
    selectedPiece: null, // { rep: 'pieceRep', color: 'pieceColor', coordinates: [-1, -1] },
    lastMove: [],
    result: ResultStatus.STILL_GAMING,
    showAvailableMoves: true,
    chessPiecesEnum: ChessPiece,
    EMPTY: 'e'
  },
  plugins: [createPersistedState({
    storage: sessionStorage
  })],
  getters: {

  },
  mutations: {
    setChessboard: (state, payload) => {
      state.chessboard = payload
    },
    setCurrentTurn: (state, color) => {
      state.currentTurn = color
    },
    switchPlayerColor: (state) => {
      state.playerColor = state.playerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    },
    toggleShowAvailableMoves: (state) => {
      state.showAvailableMoves = !state.showAvailableMoves
    },
    setResult: (state, result) => {
      state.result = result
    },
    selectPiece: (state, payload) => {
      let representation = state.chessboard[payload.x][payload.y]
      let color = Object.values(state.chessPiecesEnum).filter(element => element.rep === representation).map(element => element.color).pop()
      state.selectedPiece = {
        rep: representation,
        color: color,
        coordinates: [payload.x, payload.y]
      }
    },
    deselectPiece: (state) => {
      state.selectedPiece = null
    },
    highlightLastMove: (state, payload) => {
      state.lastMove = payload
    }
  },
  actions: {
    setChessboard: (context, url) => {
      axios.post(url).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },
    pollResult: (context, url) => {
      axios.get(url).then(response => {
        context.commit('setResult', response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    pollTurn: (context, url) => {
      axios.get(url).then(response => {
        context.commit('setCurrentTurn', response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    pollChessboard: (context, url) => {
      axios.get(url).then(response => {
        context.commit('setChessboard', response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    pollLastMoved: (context, url) => {
      axios.get(url).then(response => {
        context.commit('highlightLastMove', response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    generalPoll: (context) => {
      axios.get('http://localhost:5000/result')
        .then(response => {
          context.commit('setResult', response.data)
        }).catch(resultError => console.log(resultError)).finally(() => {
          axios.get('http://localhost:5000/chessboard').then(response => {
            context.commit('setChessboard', response.data)
          }).catch(chessboardError => console.log(chessboardError)).finally(() => {
            axios.get('http://localhost:5000/turn')
              .then(response => {
                context.commit('setCurrentTurn', response.data)
              }).catch(turnError => console.log(turnError))
          })
        })
    }
  }
})
