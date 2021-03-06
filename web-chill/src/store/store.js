import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const serverUrl = 'http://' + window.location.host

const PlayerColor = {
  BLACK: 'black',
  WHITE: 'white'
}

const ResultStatus = {
  NOTHING: 'nothing',
  BLACK_WON: 'black_won',
  WHITE_WON: 'white_won',
  DRAW: 'draw',
  BLACK_UNDER_CHECK: 'black_in_check',
  WHITE_UNDER_CHECK: 'white_in_check'
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
    selection: null, // { piece: 'wp', coordinates: [1, 2] },
    lastMove: [],
    availableMoves: [],
    showAvailableMoves: true,
    result: ResultStatus.NOTHING,
    ongoingPromotion: null, // { piece: 'wp', startPoint: '[1, 2]', endPoint: '[1, 3]' },
    movingTo: null, // [x, y]
    chessPiecesEnum: ChessPiece,
    chessResultEnum: ResultStatus,
    playerColorEnum: PlayerColor,
    EMPTY: 'e'
  },
  plugins: [createPersistedState({
    storage: sessionStorage
  })],
  getters: {
    myQueen: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WQ.rep : state.chessPiecesEnum.BQ.rep,
    myRook: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WR.rep : state.chessPiecesEnum.BR.rep,
    myBishop: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WB.rep : state.chessPiecesEnum.BB.rep,
    myKnight: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WN.rep : state.chessPiecesEnum.BN.rep,
    myPawn: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WP.rep : state.chessPiecesEnum.BP.rep,
    myKing: state => state.playerColor === state.playerColorEnum.WHITE ? state.chessPiecesEnum.WK.rep : state.chessPiecesEnum.BK.rep,
    pieceColor: state => piece =>
      Object.values(state.chessPiecesEnum)
        .filter(element => element.rep === piece)
        .map(element => element.color)
        .pop()
  },
  mutations: {
    setChessboard: (state, payload) => { state.chessboard = payload },
    setCurrentTurn: (state, payload) => { state.currentTurn = payload },
    setResult: (state, payload) => { state.result = payload },
    setLastMove: (state, payload) => { state.lastMove = payload },
    setAvailableMoves: (state, payload) => { state.availableMoves = payload },
    setOngoingPromotion: (state, payload) => { state.ongoingPromotion = payload },
    toggleShowAvailableMoves: state => { state.showAvailableMoves = !state.showAvailableMoves },
    togglePlayerColor: state => {
      state.availableMoves = []
      state.selection = null
      state.playerColor = state.playerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    },
    selectPiece: (state, payload) => {
      state.selection = {
        piece: state.chessboard[payload.x][payload.y],
        coordinates: [payload.x, payload.y]
      }
    },
    deselectPiece: state => {
      state.availableMoves = []
      state.selection = null
    }
  },
  actions: {
    setChessboard: context => {
      axios.post(serverUrl + '/chessboard').then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },
    pollAvailableMoves: (context, payload) => {
      let params = { startPoint: '[' + payload.x + ',' + payload.y + ']' }
      axios.get(serverUrl + '/move/available', { params: params }, { headers: {'Content-Type': 'application/json'} }).then(response => {
        context.commit('setAvailableMoves', response.data)
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
        context.commit('setLastMove', response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    generalPoll: (context) => {
      axios.get(serverUrl + '/result')
        .then(response => {
          context.commit('setResult', response.data)
        }).catch(resultError => console.log(resultError)).finally(() => {
          axios.get(serverUrl + '/chessboard').then(response => {
            context.commit('setChessboard', response.data)
          }).catch(chessboardError => console.log(chessboardError)).finally(() => {
            axios.get(serverUrl + '/turn')
              .then(response => {
                context.commit('setCurrentTurn', response.data)
              }).catch(turnError => console.log(turnError))
          })
        })
    },
    doMove: function (context, payload) {
      context.state.movingTo = payload.endPoint
      axios.post(serverUrl + '/move', {
        piece: payload.piece,
        startPoint: payload.startPoint,
        endPoint: payload.endPoint
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        context.state.movingTo = []
        if (response.length > 0) context.state.result = ResultStatus.NOTHING
      })
    },
    doMoveWithPromotion: function (context, payload) {
      axios.post(serverUrl + '/move/withpromotion', {
        piece: payload.piece,
        startPoint: payload.startPoint,
        endPoint: payload.endPoint,
        promotion: payload.promotion
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (response.length > 0) context.state.result = ResultStatus.NOTHING
      })
    },
    doShortCastle: function (context, payload) {
      axios.post(serverUrl + '/move/shortcastle', {
        piece: payload.piece,
        startPoint: payload.startPoint
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (response.length > 0) context.state.result = ResultStatus.NOTHING
      })
    },
    doLongCastle: function (context, payload) {
      axios.post(serverUrl + '/move/longcastle', {
        piece: payload.piece,
        startPoint: payload.startPoint
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (response.length > 0) context.state.result = ResultStatus.NOTHING
      })
    }
  }
})
