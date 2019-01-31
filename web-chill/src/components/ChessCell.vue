<template>
  <td v-on:click="cellClicked" v-bind:class="[color, selected ? 'selected' : '']">
    {{this.x}}{{this.y}}
    {{piece}}
  </td>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'x',
    'y'
  ],
  computed: {
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
          // chiamata remota
        }
      }
    }
  }
}
</script>

<style lang="scss">

.dark {
  background-color: black
}

.light {
  background-color: white
}

.selected {
  background-color: yellow
}

</style>
