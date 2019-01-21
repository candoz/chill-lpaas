import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const PlayerColor = {
  BLACK: 'black',
  WHITE: 'white'
}

const ResultStatus = {
  STILL_GAMING: 'still gaming',
  BLACK_WON: 'black',
  WHITE_WON: 'white',
  DRAW: 'draw'
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
        x: i,
        y: j,
        piece: ChessPiece.EMPTY,
        selected: false
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
    chessboard: createTestChessBoard(),
    result: ResultStatus.STILL_GAMING
  },
  getters: {
    currentChessboard: (state) => {
      return state.chessboard
    },
    cellsSelectedInBoard: (state) => {
      return state.chessboard.flat().filter(cell => cell.selected)
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
    switchCellSelection: (state, payload) => {
      state.chessboard[payload.x][payload.y].selected = state.chessboard[payload.x][payload.y].selected !== true
    }
  },
  actions: {
    setChessboard: (context, url) => {
      setTimeout(function () {
        // ask to server the current chessboard state insted timeout function
        context.commit('setChessboard', testChessBoard)
      }, 100)
    }
  }
})
