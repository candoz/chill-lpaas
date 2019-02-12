<template>
  <div>
    <button v-on:click="chessReset">Reset Match</button>
    <button v-on:click="switchPlayer">Switch Player</button>
    <label>Current Result: {{ $store.state.result }}</label>
    <label>Current Turn: {{ $store.state.currentTurn }}</label>
    <player-switch></player-switch>
  </div>
</template>

<script>
import PlayerSwitch from './PlayerSwitch.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    PlayerSwitch
  },
  computed: {
    player () {
      return this.$store.state.playerColor
    }
  },
  methods: {
    chessReset: function () {
      this.$store.dispatch('setChessboard', 'http://localhost:5000/chessboard')
    },
    switchPlayer: function () {
      this.$store.commit('switchPlayerColor')
    }
  }
}
</script>

<style lang="scss">

</style>
