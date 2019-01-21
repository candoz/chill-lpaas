<template>
  <td v-on:click="selectCell" v-bind:class="[color, selected ? 'selected' : '']">
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
      return this.$store.state.chessboard[this.x][this.y].piece
    },
    selected () {
      return this.$store.state.chessboard[this.x][this.y].selected
    },
    color () {
      return (this.x + this.y) % 2 === 0 ? 'light' : 'dark'
    }
  },
  methods: {
    selectCell: function () {
      // TODO Check if piece owner
      let selectedCells = this.$store.getters.cellsSelectedInBoard
      console.log(selectedCells)
      if (selectedCells.length > 0) {
        selectedCells.forEach(cell => {
          this.$store.commit('switchCellSelection',
            {
              x: cell.x,
              y: cell.y
            })
        })
      } else {
        this.$store.commit('switchCellSelection',
          {
            x: this.x,
            y: this.y
          })
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
