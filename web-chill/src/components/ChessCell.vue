<template>
  <td v-on:click="cellClicked" v-bind:class="[cellColor, selected || lastMoved ? 'selected' : '', (availableAsMove && showingAvailableMoves) ? 'available' : '', underCheck ? 'undercheck' : '']">
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
    cellColor () { return (this.x + this.y) % 2 === 0 ? 'dark' : 'light' },
    lastMoved () { return this.isArrayInArray([this.x, this.y], this.$store.state.lastMove) },
    availableAsMove () { return this.isArrayInArray([this.x, this.y], this.$store.state.availableMoves) },
    showingAvailableMoves () { return this.$store.state.showAvailableMoves },
    piece () { return this.$store.state.chessboard[this.x][this.y] },
    pieceImg () { return require('../assets/' + this.piece + '.png') },
    containingAKing () {
      return this.piece === this.$store.state.chessPiecesEnum.WK.rep ||
        this.piece === this.$store.state.chessPiecesEnum.BK.rep
    },
    selected () {
      let selection = this.$store.state.selection
      return selection != null && JSON.stringify(selection.coordinates) === JSON.stringify([this.x, this.y])
    },
    underCheck () {
      return this.containingAKing && (
        (this.$store.state.result === this.$store.state.chessResultEnum.BLACK_UNDER_CHECK &&
        this.$store.getters.pieceColor(this.piece) === this.$store.state.playerColorEnum.BLACK) ||
        (this.$store.state.result === this.$store.state.chessResultEnum.WHITE_UNDER_CHECK &&
        this.$store.getters.pieceColor(this.piece) === this.$store.state.playerColorEnum.WHITE)
      )
    }
  },
  methods: {
    cellClicked () {
      if (this.$store.state.selection == null) {
        if (this.containsMyPieceAndIsMyTurn()) {
          this.$store.dispatch('pollAvailableMoves', {
            x: this.x,
            y: this.y
          })
          this.$store.commit('selectPiece', {
            x: this.x,
            y: this.y
          })
        }
      } else {
        let selection = this.$store.state.selection // keep it for the deselection!
        if (this.$store.state.playerColor === this.$store.getters.pieceColor(selection.piece)) {
          let payload = {
            piece: selection.piece,
            startPoint: selection.coordinates,
            endPoint: [this.x, this.y]
          }
          if (this.mustPromote(selection)) {
            this.$store.state.ongoingPromotion = payload
            this.$modal.show('promotion-modal')
          } else if (this.wantsToShortCastle(selection)) this.$store.dispatch('doShortCastle', payload)
          else if (this.wantsToLongCastle(selection)) this.$store.dispatch('doLongCastle', payload)
          else this.$store.dispatch('doMove', payload)
        }
        this.$store.commit('deselectPiece')
      }
    },
    containsMyPieceAndIsMyTurn () {
      return this.piece != null &&
        this.$store.getters.pieceColor(this.piece) === this.$store.state.playerColor &&
        this.$store.state.currentTurn === this.$store.state.playerColor
    },
    wantsToShortCastle (selection) {
      return selection.piece === this.$store.getters.myKing && selection.coordinates[0] === this.x - 2
    },
    wantsToLongCastle (selection) {
      return selection.piece === this.$store.getters.myKing && selection.coordinates[0] === this.x + 2
    },
    mustPromote (selection) {
      return selection.piece === this.$store.getters.myPawn &&
        (
          (this.y === 0 && this.$store.state.selection.coordinates[1] === 1 && this.$store.getters.pieceColor(selection.piece) === this.$store.state.playerColorEnum.BLACK) ||
          (this.y === 7 && this.$store.state.selection.coordinates[1] === 6 && this.$store.getters.pieceColor(selection.piece) === this.$store.state.playerColorEnum.WHITE)
        )
    },
    isArrayInArray (item, arr) {
      return arr.some(elem => JSON.stringify(elem) === JSON.stringify(item))
    }
  }
}
</script>

<style lang="scss">

$highlight: rgba(238,174,202,1);
$check-highlight: rgba(252, 77, 77, 1);

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
  background-image: radial-gradient(circle, rgba(255,255,255,0) 50%, $check-highlight 100%);
}

</style>
