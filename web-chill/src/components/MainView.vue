<template>
  <div>
    <dashboard></dashboard>
    <chessboard></chessboard>
    <modal id="promotion-modal" name='promotion-modal'>
      <label id="promotion-label">Choose promotion for your pawn: </label>
      <img class="piece-img" v-bind:src="myQueenImg" width="20%" v-on:click="promote(myQueen)"/>
      <img class="piece-img" v-bind:src="myRookImg" width="20%" v-on:click="promote(myRook)"/>
      <img class="piece-img" v-bind:src="myBishopImg" width="20%" v-on:click="promote(myBishop)"/>
      <img class="piece-img" v-bind:src="myKnightImg" width="20%" v-on:click="promote(myKnight)"/>
    </modal>
    <modal id="end-game-modal" name='end-game-modal'>
      <label id="result-label">{{ resultStr }}</label>
      <md-button class="md-raised md-primary" @click="newGame">New Game</md-button>
    </modal>
  </div>
</template>

<script>
import Dashboard from './Dashboard.vue'
import Chessboard from './Chessboard.vue'

export default {
  components: {
    Dashboard,
    Chessboard
  },
  computed: {
    myQueenImg () { return require('../assets/' + this.myQueen + '.png') },
    myRookImg () { return require('../assets/' + this.myRook + '.png') },
    myBishopImg () { return require('../assets/' + this.myBishop + '.png') },
    myKnightImg () { return require('../assets/' + this.myKnight + '.png') },
    myQueen () { return this.$store.getters.myQueen },
    myRook () { return this.$store.getters.myRook },
    myBishop () { return this.$store.getters.myBishop },
    myKnight () { return this.$store.getters.myKnight },
    result () {
      let result = this.$store.state.result
      let resultEnum = this.$store.state.chessResultEnum
      if ((result === resultEnum.WHITE_WON || result === resultEnum.BLACK_WON || result === resultEnum.DRAW)) {
        this.$modal.show('end-game-modal')
      } else {
        this.$modal.hide('end-game-modal')
      }
      return result
    },
    resultStr () {
      if (this.$store.state.result === 'white_won') return 'White player won'
      else if (this.$store.state.result === 'black_won') return 'Black player won'
      else if (this.$store.state.result === 'draw') return 'Game ended in a draw'
      else return 'Game on!'
    }
  },
  methods: {
    promote: function (piece) {
      this.$modal.hide('promotion-modal')
      let oldPayload = this.$store.state.ongoingPromotion
      let updatedPayload = {
        piece: oldPayload.piece,
        startPoint: oldPayload.startPoint,
        endPoint: oldPayload.endPoint,
        promotion: piece
      }
      this.$store.state.ongoingPromotion = null
      this.$store.dispatch('doMoveWithPromotion', updatedPayload)
    },
    newGame: function () {
      this.$store.dispatch('setChessboard')
    }
  },
  mounted: function () {
    this.$modal.show('end-game-modal')
    // this.$modal.show('promotion-modal')
  }
}
</script>

<style lang="scss">

.md-button {
  margin: 2.5vmin;
  height: 25px;
  width: 115px;
  color: white;
  background-color: #5B83A9;
}

.v--modal {
  text-align: center;
  display: block;
  color: black;
}

#result-label {
  display: block;
  margin-top: 5vmin;
  font-size: 1.2em;
}

#promotion-label {
  display: block;
}

.piece-img {
  display: inline-block;
  height: 20vmax;
}

.v--modal-box {
  width: 50vmin !important;
  left: 0 !important;
  margin: auto !important;
  top: 20% !important;
  height: 20vmin !important;
  min-height: 100px;
  text-align: center !important;
}
</style>
