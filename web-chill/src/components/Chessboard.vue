<template>
  <div>
    <table v-if="player=='white'">
      <tr><td>8</td><chess-cell v-for="xRow8 in boardSide" :key="xRow8" :x="xRow8 -1" :y="7"></chess-cell><td> </td></tr>
      <tr><td>7</td><chess-cell v-for="xRow7 in boardSide" :key="xRow7" :x="xRow7 -1" :y="6"></chess-cell><td> </td></tr>
      <tr><td>6</td><chess-cell v-for="xRow6 in boardSide" :key="xRow6" :x="xRow6 -1" :y="5"></chess-cell><td> </td></tr>
      <tr><td>5</td><chess-cell v-for="xRow5 in boardSide" :key="xRow5" :x="xRow5 -1" :y="4"></chess-cell><td> </td></tr>
      <tr><td>4</td><chess-cell v-for="xRow4 in boardSide" :key="xRow4" :x="xRow4 -1" :y="3"></chess-cell><td> </td></tr>
      <tr><td>3</td><chess-cell v-for="xRow3 in boardSide" :key="xRow3" :x="xRow3 -1" :y="2"></chess-cell><td> </td></tr>
      <tr><td>2</td><chess-cell v-for="xRow2 in boardSide" :key="xRow2" :x="xRow2 -1" :y="1"></chess-cell><td> </td></tr>
      <tr><td>1</td><chess-cell v-for="xRow1 in boardSide" :key="xRow1" :x="xRow1 -1" :y="0"></chess-cell><td> </td></tr>
      <tr><td> </td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td></tr>
    </table>
    <table v-else>
      <tr><td>1</td><chess-cell v-for="xRow8 in boardSide" :key="xRow8" :x="boardSide - xRow8" :y="0"></chess-cell><td> </td></tr>
      <tr><td>2</td><chess-cell v-for="xRow7 in boardSide" :key="xRow7" :x="boardSide - xRow7" :y="1"></chess-cell><td> </td></tr>
      <tr><td>3</td><chess-cell v-for="xRow6 in boardSide" :key="xRow6" :x="boardSide - xRow6" :y="2"></chess-cell><td> </td></tr>
      <tr><td>4</td><chess-cell v-for="xRow5 in boardSide" :key="xRow5" :x="boardSide - xRow5" :y="3"></chess-cell><td> </td></tr>
      <tr><td>5</td><chess-cell v-for="xRow4 in boardSide" :key="xRow4" :x="boardSide - xRow4" :y="4"></chess-cell><td> </td></tr>
      <tr><td>6</td><chess-cell v-for="xRow3 in boardSide" :key="xRow3" :x="boardSide - xRow3" :y="5"></chess-cell><td> </td></tr>
      <tr><td>7</td><chess-cell v-for="xRow2 in boardSide" :key="xRow2" :x="boardSide - xRow2" :y="6"></chess-cell><td> </td></tr>
      <tr><td>8</td><chess-cell v-for="xRow1 in boardSide" :key="xRow1" :x="boardSide - xRow1" :y="7"></chess-cell><td> </td></tr>
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
  }
}
</script>

<style lang="scss">

table {
  table-layout: fixed;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
}

th, td {
  width: 9vmin;
  height: 9vmin;
  padding: none;
  margin: none;
  color: #EDECD5;
  font-weight: bold;
}

div {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>
