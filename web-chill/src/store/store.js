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
  for (let i = 0; i <= 8; i++) {
    matrix[i] = []
    for (let j = 0; j <= 8; j++) {
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
    // products: [
    //     {name: 'Banana Skin', price: 20},
    //     {name: 'Shiny Star', price: 40},
    //     {name: 'Green Shells', price: 60},
    //     {name: 'Red Shells', price: 80}
    // ]
    currentTurn: PlayerColor.WHITE,
    playerColor: PlayerColor.WHITE,
    chessboard: createTestChessBoard(),
    result: ResultStatus.STILL_GAMING
  },
  getters: {
    // saleProducts: (state) => {
    //     var saleProducts = state.products.map( product => {
    //         return {
    //             name:  '**' + product.name + '**',
    //             price: product.price / 2,
    //         };
    //     });
    //     return saleProducts;
    // }
    currentChessboard: (state) => {
      return state.chessboard
    }
  },
  mutations: {
    // reducePrice: (state, payload) => {
    //     state.products.forEach( product => {
    //         product.price -= payload
    //     });
    // }
    setChessboard: (state, payload) => {
      state.chessboard = payload
    },
    setCurrentTurn: (state, color) => {
      state.currentTurn = color
    },
    setPlayerColor: (state) => {
      state.playerColor = state.playerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    },
    setResult: (state, result) => {
      state.result = result
    }
  },
  actions: {
    // reducePrice: (context, payload) => {
    //     setTimeout(function(){ // reach out for data
    //         context.commit('reducePrice', payload);
    //     }, 2000);
    // }
    setChessboard: (context, url) => {
      setTimeout(function () {
        // ask to server the current chessboard state insted timeout function
        context.commit('setChessboard', testChessBoard)
      }, 100)
    },
    switchPlayer: (context) => {
      context.commit('setPlayerColor')
    }
  }
})
