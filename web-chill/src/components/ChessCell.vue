<template>
  <td v-on:click="cellClicked" v-bind:class="[color, selected || lastMoved ? 'selected' : '', availableAsMove ? 'available' : '', underCheck ? 'undercheck' : '']">
    <img v-bind:src="pieceImg" width="90%" v-if="piece !== 'e'" />
  </td>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: [
    'x',
    'y'
  ],
  computed: {
    pieceImg () {
      return require('../assets/' + this.piece + '.png')
    },
    piece () {
      return this.$store.state.chessboard[this.x][this.y]
    },
    selected () {
      return this.$store.state.selectedPiece != null &&
        JSON.stringify(this.$store.state.selectedPiece.coordinates) === JSON.stringify([this.x, this.y]) // TODO also same piece
    },
    color () {
      return (this.x + this.y) % 2 === 0 ? 'dark' : 'light'
    },
    lastMoved () {
      return this.isArrayInArray([this.x, this.y], this.$store.state.lastMove)
    },
    availableAsMove () {
      return this.isArrayInArray([this.x, this.y], this.$store.state.availableMoves)
    },
    underCheck () {
      if (this.$store.state.result === this.$store.state.chessResultEnum.UNDER_CHECK) {
        if (this.$store.state.currentTurn === this.$store.state.playerColorEnum.WHITE && this.piece === this.$store.state.chessPiecesEnum.WK.rep) {
          return true
        } else if (this.$store.state.currentTurn === this.$store.state.playerColorEnum.BLACK && this.piece === this.$store.state.chessPiecesEnum.BK.rep) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    cellClicked: function () {
      if (this.$store.state.selectedPiece == null) {
        if (this.$store.state.chessboard[this.x][this.y] !== this.$store.state.EMPTY) {
          this.$store.commit('selectPiece', {
            x: this.x,
            y: this.y
          })
        }
        if (this.$store.state.showAvailableMoves) {
          this.$store.dispatch('availableMoves', {
            url: 'http://localhost:5000/move/available',
            x: this.x,
            y: this.y
          })
        }
      } else {
        let piece = this.$store.state.selectedPiece // keep it for the deselection!
        let availableMoves = this.$store.state.availableMoves // keep it for the deselection!
        this.$store.commit('deselectPiece')
        if (piece.color === this.$store.state.playerColor && this.isArrayInArray([this.x, this.y], availableMoves)) {
          let payload = {
            piece: piece.rep,
            startPoint: piece.coordinates,
            endPoint: [this.x, this.y]
          }
          if (this.mustPromote(piece)) {
            this.$store.state.ongoingPromotion = payload
            this.$modal.show('promotion-modal')
          } else if (this.wantsToShortCastle(piece)) this.$store.dispatch('doShortCastle', payload)
          else if (this.wantsToLongCastle(piece)) this.$store.dispatch('doLongCastle', payload)
          else this.$store.dispatch('doMove', payload)
        }
      }
    },
    wantsToShortCastle: function (piece) {
      return this.isKing(piece) && this.x === piece.coordinates[0] + 2
    },
    wantsToLongCastle: function (piece) {
      return this.isKing(piece) && this.x === piece.coordinates[0] - 2
    },
    mustPromote: function (piece) {
      return this.isPawn(piece) && (this.y === 0 || this.y === 7)
    },
    isPawn: function (piece) {
      return piece.rep === this.$store.state.chessPiecesEnum.WP.rep ||
        piece.rep === this.$store.state.chessPiecesEnum.BP.rep
    },
    isKing: function (piece) {
      return piece.rep === this.$store.state.chessPiecesEnum.WK.rep ||
        piece.rep === this.$store.state.chessPiecesEnum.BK.rep
    },
    isArrayInArray: function (item, arr) {
      var itemAsString = JSON.stringify(item)
      var contains = arr.some(function (ele) {
        return JSON.stringify(ele) === itemAsString
      })
      return contains
    }
  }
}
</script>

<style lang="scss">

$highlight: rgba(238,174,202,1);
$chess-highlight: rgba(252, 77, 77, 1);

.dark {
  background-color: #5B83A9;
}

.light {
  background-color: #EDECD5;
}

.selected {
  background-color: #76C7E9
}

.available {
  background-image: radial-gradient(circle, $highlight 0%, rgba(255,255,255,0) 100%);
}

.undercheck {
  background-image: radial-gradient(circle, rgba(255,255,255,0) 50%, $chess-highlight 100%);
}

</style>
