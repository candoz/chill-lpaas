<template>
  <div>
    <button v-on:click="initializeChessboard">Click Me!</button>
    <button v-on:click="switchPlayer">Switch Player</button>
    <table v-if="player=='white'">
      <tr><td>8</td><chess-cell v-for="xRow8 in boardSide" :key="xRow8" :x="xRow8" :y="7"></chess-cell></tr>
      <tr><td>7</td><chess-cell v-for="xRow7 in boardSide" :key="xRow7" :x="xRow7" :y="6"></chess-cell></tr>
      <tr><td>6</td><chess-cell v-for="xRow6 in boardSide" :key="xRow6" :x="xRow6" :y="5"></chess-cell></tr>
      <tr><td>5</td><chess-cell v-for="xRow5 in boardSide" :key="xRow5" :x="xRow5" :y="4"></chess-cell></tr>
      <tr><td>4</td><chess-cell v-for="xRow4 in boardSide" :key="xRow4" :x="xRow4" :y="3"></chess-cell></tr>
      <tr><td>3</td><chess-cell v-for="xRow3 in boardSide" :key="xRow3" :x="xRow3" :y="2"></chess-cell></tr>
      <tr><td>2</td><chess-cell v-for="xRow2 in boardSide" :key="xRow2" :x="xRow2" :y="1"></chess-cell></tr>
      <tr><td>1</td><chess-cell v-for="xRow1 in boardSide" :key="xRow1" :x="xRow1" :y="0"></chess-cell></tr>
      <tr><td></td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td></tr>
    </table>
    <table v-else>
      <tr><td>1</td><chess-cell v-for="xRow8 in boardSide" :key="xRow8" :x="xRow8" :y="7"></chess-cell></tr>
      <tr><td>2</td><chess-cell v-for="xRow7 in boardSide" :key="xRow7" :x="xRow7" :y="6"></chess-cell></tr>
      <tr><td>3</td><chess-cell v-for="xRow6 in boardSide" :key="xRow6" :x="xRow6" :y="5"></chess-cell></tr>
      <tr><td>4</td><chess-cell v-for="xRow5 in boardSide" :key="xRow5" :x="xRow5" :y="4"></chess-cell></tr>
      <tr><td>5</td><chess-cell v-for="xRow4 in boardSide" :key="xRow4" :x="xRow4" :y="3"></chess-cell></tr>
      <tr><td>6</td><chess-cell v-for="xRow3 in boardSide" :key="xRow3" :x="xRow3" :y="2"></chess-cell></tr>
      <tr><td>7</td><chess-cell v-for="xRow2 in boardSide" :key="xRow2" :x="xRow2" :y="1"></chess-cell></tr>
      <tr><td>8</td><chess-cell v-for="xRow1 in boardSide" :key="xRow1" :x="xRow1" :y="0"></chess-cell></tr>
      <tr><td></td><td>H</td><td>G</td><td>F</td><td>E</td><td>D</td><td>C</td><td>B</td><td>A</td></tr>
    </table>
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
    },
    switchPlayer: function () {
      this.$store.dispatch('switchPlayer')
    }
  }
}
</script>

<style lang="scss">

</style>
