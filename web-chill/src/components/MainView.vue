<template>
  <div>
    <dashboard></dashboard>
    <chessboard></chessboard>
    <modal name='promotion-modal'>
      <img v-bind:src="queenImg" width="20%" v-on:click="promote(myQueen())"/>
      <img v-bind:src="rookImg" width="20%" v-on:click="promote(myRook())"/>
      <img v-bind:src="bishopImg" width="20%" v-on:click="promote(myBishop())"/>
      <img v-bind:src="knightImg" width="20%" v-on:click="promote(myKnight())"/>
    </modal>
    <modal name='end-game-modal'>
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
    queenImg () {
      return require('../assets/' + this.myQueen() + '.png')
    },
    rookImg () {
      return require('../assets/' + this.myRook() + '.png')
    },
    bishopImg () {
      return require('../assets/' + this.myBishop() + '.png')
    },
    knightImg () {
      return require('../assets/' + this.myKnight() + '.png')
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
    myQueen: function () {
      if (this.$store.state.playerColor === this.$store.state.playerColorEnum.WHITE) {
        return this.$store.state.chessPiecesEnum.WQ.rep
      } else {
        return this.$store.state.chessPiecesEnum.BQ.rep
      }
    },
    myRook: function () {
      if (this.$store.state.playerColor === this.$store.state.playerColorEnum.WHITE) {
        return this.$store.state.chessPiecesEnum.WR.rep
      } else {
        return this.$store.state.chessPiecesEnum.BR.rep
      }
    },
    myBishop: function () {
      if (this.$store.state.playerColor === this.$store.state.playerColorEnum.WHITE) {
        return this.$store.state.chessPiecesEnum.WB.rep
      } else {
        return this.$store.state.chessPiecesEnum.BB.rep
      }
    },
    myKnight: function () {
      if (this.$store.state.playerColor === this.$store.state.playerColorEnum.WHITE) {
        return this.$store.state.chessPiecesEnum.WN.rep
      } else {
        return this.$store.state.chessPiecesEnum.BN.rep
      }
    }
  }
}
</script>

<style lang="scss">
</style>
