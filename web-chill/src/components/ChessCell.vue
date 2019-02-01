<template>
  <td v-on:click="cellClicked" v-bind:class="[color, selected ? 'selected' : '']">
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
    }
  },
  methods: {
    cellClicked: function () {
      let currentSelection = this.$store.state.selectedPiece

      if (currentSelection == null) {
        if (this.$store.state.chessboard[this.x][this.y] !== this.$store.state.EMPTY) {
          this.$store.commit('selectPiece', {
            x: this.x,
            y: this.y
          })
        }
      } else {
        this.$store.commit('deselectPiece')
        if (currentSelection.color === this.$store.state.playerColor) {
          axios.post('http://localhost:5000/move', {
            piece: currentSelection.rep,
            startPoint: currentSelection.coordinates,
            endPoint: [this.x, this.y]
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">

.dark {
  background-color: #5B83A9
}

.light {
  background-color: #EDECD5
}

.selected {
  background-color: #76C7E9
}

</style>
