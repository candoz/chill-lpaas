<template>
  <td v-on:click="cellClicked" v-bind:class="[color, selected || lastMoved ? 'selected' : '', availableAsMove ? 'available' : '']">
    <img v-bind:src="pieceImg" width="90%" v-if="piece !== 'e'" />
  </td>
</template>

<script>
import axios from 'axios'
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
      return this.isArrayInArray(this.$store.state.lastMove, [this.x, this.y])
    },
    availableAsMove () {
      return this.isArrayInArray(this.$store.state.availableMoves, [this.x, this.y])
    }
  },
  methods: {
    cellClicked: function () {
      let piece = this.$store.state.selectedPiece // keep it for the deselection!
      if (piece == null) {
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
        this.$store.commit('deselectPiece')
        if (piece.color === this.$store.state.playerColor) {
          if (this.wantsToShortCastle(piece)) this.do('move/shortcastle', piece)
          else if (this.wantsToLongCastle(piece)) this.do('move/longcastle', piece)
          else this.do('move', piece)
        }
      }
    },
    do: function (whatKindOfMove, piece) {
      axios.post('http://localhost:5000/' + whatKindOfMove, {
        piece: piece.rep,
        startPoint: piece.coordinates,
        endPoint: [this.x, this.y]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    wantsToShortCastle: function (piece) {
      return this.isKing(piece) && this.x === piece.coordinates[0] + 2
    },
    wantsToLongCastle: function (piece) {
      return this.isKing(piece) && this.x === piece.coordinates[0] - 2
    },
    isKing: function (piece) {
      return piece.rep === this.$store.state.chessPiecesEnum.WK.rep ||
        piece.rep === this.$store.state.chessPiecesEnum.BK.rep
    },
    isArrayInArray: function (arr, item) {
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
// $chess-highlight: rgba();

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

</style>
