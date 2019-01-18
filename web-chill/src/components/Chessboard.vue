<template>
  <div>
    <button v-on:click="initializeChessboard">Click Me!</button>
    <div v-if="player=='white'">
      8 <chess-cell v-for="xRow8 in 9" :key="xRow8" :x="xRow8" :y="7"></chess-cell>
      7 <chess-cell v-for="xRow7 in boardSide" :key="xRow7" :x="xRow7" :y="6"></chess-cell>
      6 <chess-cell v-for="xRow6 in boardSide" :key="xRow6" :x="xRow6" :y="5"></chess-cell>
      5 <chess-cell v-for="xRow5 in boardSide" :key="xRow5" :x="xRow5" :y="4"></chess-cell>
      4 <chess-cell v-for="xRow4 in boardSide" :key="xRow4" :x="xRow4" :y="3"></chess-cell>
      3 <chess-cell v-for="xRow3 in boardSide" :key="xRow3" :x="xRow3" :y="2"></chess-cell>
      2 <chess-cell v-for="xRow2 in boardSide" :key="xRow2" :x="xRow2" :y="1"></chess-cell>
      1 <chess-cell v-for="xRow1 in boardSide" :key="xRow1" :x="xRow1" :y="0"></chess-cell>
      A B C D E F G H
    </div>
    <div v-else>
      <h1>Ops...questo è imbarazzante</h1>
    </div>
  </div>
</template>

<script>
import ChessCell from './ChessCell.vue'

export default {
  data () {
    return {
      boardSide: 8
    }
  },
  components: {
    ChessCell
  },
  computed: {
    player () {
      return this.$store.state.playerColor
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
