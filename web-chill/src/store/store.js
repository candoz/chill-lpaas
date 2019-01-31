import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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

const ChessPiece = {
  WP: 'wp',
  WB: 'wb',
  WN: 'wn',
  WR: 'wr',
  WK: 'wk',
  WQ: 'wq',
  BP: 'bp',
  BB: 'bb',
  BN: 'bn',
  BR: 'br',
  BK: 'bk',
  BQ: 'bq',
  EMPTY: 'e'
}

const testChessBoard = createTestChessBoard()
function createTestChessBoard () {
  let matrix = []
  for (let i = 0; i < 8; i++) {
    matrix[i] = []
    for (let j = 0; j < 8; j++) {
      matrix[i][j] = {
        piece: ChessPiece.EMPTY
      }
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
    selectedCells: [],
    result: ResultStatus.STILL_GAMING
  },
  getters: {
    currentChessboard: (state) => {
      return state.chessboard
    },
    cellsSelectedInBoard: (state) => {
      return selectedCells
    }
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
    setResult: (state, result) => {
      state.result = result
    },
    addSelectedCell: (state, cell) => {
      state.selectedCells.push(cell)
    }
  },
  actions: {
    setChessboard: (context, url) => {
      axios.get(url).then(response => {
        context.commit('setChessboard', response)
      }).catch(error => {
        console.log(error)
      })
    }
    // POLLING risultato, turno, scacchiera
  }
})
