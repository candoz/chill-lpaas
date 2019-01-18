<template>
  <div>
    <chess-cell v-for="i in (boardSize-1)" :key="i" :x="Math.trunc(i/8)" :y="i%8"></chess-cell>
    <button v-on:click="initializeChessboard">Click Me!</button>
  </div>
</template>

<script>
import ChessCell from './ChessCell.vue'

export default {
  data () {
    return {
      boardSize: 64
    }
  },
  components: {
    ChessCell
  },
  computed: {
    chessboard () {
      return this.$store.state.chessboard
    }
  },
  methods: {
    initializeChessboard: function () {
      this.$store.dispatch('setChessboard', 'url')
    }
  }
}
</script>

<style lang="scss">

</style>
