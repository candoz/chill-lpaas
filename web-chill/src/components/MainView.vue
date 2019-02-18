<template>
  <div>
    <dashboard></dashboard>
    <chessboard></chessboard>
    <modal name='promotion-modal'>
      <img v-bind:src="myQueenImg" width="20%" v-on:click="promote(myQueen)"/>
      <img v-bind:src="myRookImg" width="20%" v-on:click="promote(myRook)"/>
      <img v-bind:src="myBishopImg" width="20%" v-on:click="promote(myBishop)"/>
      <img v-bind:src="myKnightImg" width="20%" v-on:click="promote(myKnight)"/>
    </modal>
    <modal name='end-game-modal'>
      <label>Result: {{ result }}</label>
      <button v-on:click="newGame">New Game!</button>
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
      if ((result === resultEnum.WHITE_WON || result === resultEnum.BLACK_WON || result === resultEnum.DRAW || result === resultEnum.UNDER_CHECK)) {
        this.$modal.show('end-game-modal')
      } else {
        this.$modal.hide('end-game-modal')
      }
      return result
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
  }
}
</script>

<style lang="scss">
</style>
